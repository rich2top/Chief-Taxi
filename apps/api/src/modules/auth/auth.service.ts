import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { UsersService } from "../users/users.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";

type GoogleTokenResponse = {
  access_token?: string;
  error?: string;
  error_description?: string;
};

type GoogleProfileResponse = {
  sub?: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
};

type GoogleOAuthState = {
  returnTo: string;
  expiresAt: number;
  nonce: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService
  ) {}

  async register(input: RegisterDto) {
    const passwordHash = await bcrypt.hash(input.password, 12);
    const user = await this.usersService.create({
      fullName: input.fullName,
      email: input.email,
      phoneNumber: input.phoneNumber,
      passwordHash
    });

    return this.issueToken(user.id, user.role);
  }

  async login(input: LoginDto) {
    const user = await this.usersService.findForLogin(input.identifier);
    if (!user?.passwordHash) {
      throw new UnauthorizedException("Invalid login details.");
    }

    const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);
    if (!passwordMatches) {
      throw new UnauthorizedException("Invalid login details.");
    }

    return this.issueToken(user.id, user.role);
  }

  buildGoogleAuthUrl(returnTo?: string) {
    const clientId = this.requiredConfig("GOOGLE_OAUTH_CLIENT_ID");
    const redirectUri = this.googleRedirectUri;
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "openid email profile",
      access_type: "online",
      prompt: "select_account",
      state: this.createState(returnTo)
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  async handleGoogleCallback(input: { code?: string; state?: string; error?: string }) {
    if (input.error) {
      return this.webRedirectUrl("/login", { googleError: "Google sign-in was cancelled." });
    }

    if (!input.code || !input.state) {
      return this.webRedirectUrl("/login", { googleError: "Google sign-in could not be completed." });
    }

    try {
      const state = this.verifyState(input.state);
      const tokenResponse = await this.exchangeGoogleCode(input.code);
      if (!tokenResponse.access_token) {
        throw new UnauthorizedException(tokenResponse.error_description ?? tokenResponse.error ?? "Google token exchange failed.");
      }

      const profile = await this.fetchGoogleProfile(tokenResponse.access_token);
      if (!profile.sub || !profile.email || !profile.email_verified) {
        throw new UnauthorizedException("Google account email could not be verified.");
      }

      const user = await this.usersService.upsertGoogleCustomer({
        googleId: profile.sub,
        email: profile.email.toLowerCase(),
        fullName: profile.name,
        avatarUrl: profile.picture
      });
      const token = this.issueToken(user.id, user.role);
      const successUrl = new URL(state.returnTo);
      successUrl.hash = new URLSearchParams({
        access_token: token.accessToken,
        token_type: token.tokenType
      }).toString();

      return successUrl.toString();
    } catch {
      return this.webRedirectUrl("/login", { googleError: "Google sign-in failed. Please try again." });
    }
  }

  private issueToken(sub: string, role: string) {
    return {
      accessToken: this.jwtService.sign({ sub, role }),
      tokenType: "Bearer"
    };
  }

  private async exchangeGoogleCode(code: string) {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: this.requiredConfig("GOOGLE_OAUTH_CLIENT_ID"),
        client_secret: this.requiredConfig("GOOGLE_OAUTH_CLIENT_SECRET"),
        code,
        grant_type: "authorization_code",
        redirect_uri: this.googleRedirectUri
      })
    });

    return (await response.json()) as GoogleTokenResponse;
  }

  private async fetchGoogleProfile(accessToken: string) {
    const response = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (!response.ok) {
      throw new UnauthorizedException("Unable to read Google profile.");
    }

    return (await response.json()) as GoogleProfileResponse;
  }

  private createState(returnTo?: string) {
    const payload: GoogleOAuthState = {
      returnTo: this.safeReturnTo(returnTo),
      expiresAt: Date.now() + 10 * 60 * 1000,
      nonce: randomBytes(18).toString("hex")
    };
    const encodedPayload = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
    const signature = this.signState(encodedPayload);

    return `${encodedPayload}.${signature}`;
  }

  private verifyState(state: string) {
    const [encodedPayload, signature] = state.split(".");
    if (!encodedPayload || !signature) {
      throw new UnauthorizedException("Invalid OAuth state.");
    }

    const expectedSignature = this.signState(encodedPayload);
    if (!this.signaturesMatch(signature, expectedSignature)) {
      throw new UnauthorizedException("Invalid OAuth state.");
    }

    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as GoogleOAuthState;
    if (payload.expiresAt < Date.now()) {
      throw new UnauthorizedException("OAuth state expired.");
    }

    return {
      ...payload,
      returnTo: this.safeReturnTo(payload.returnTo)
    };
  }

  private signState(payload: string) {
    const secret = this.config.get<string>("GOOGLE_OAUTH_STATE_SECRET") ?? this.requiredConfig("JWT_SECRET");
    return createHmac("sha256", secret).update(payload).digest("base64url");
  }

  private signaturesMatch(signature: string, expectedSignature: string) {
    const provided = Buffer.from(signature);
    const expected = Buffer.from(expectedSignature);

    return provided.length === expected.length && timingSafeEqual(provided, expected);
  }

  private safeReturnTo(returnTo?: string) {
    const appUrl = this.webAppUrl;
    const fallback = new URL("/auth/google/callback", appUrl).toString();
    if (!returnTo) {
      return fallback;
    }

    try {
      const parsed = new URL(returnTo, appUrl);
      if (parsed.origin !== new URL(appUrl).origin) {
        return fallback;
      }

      return parsed.toString();
    } catch {
      return fallback;
    }
  }

  private webRedirectUrl(path: string, params?: Record<string, string>) {
    const url = new URL(path, this.webAppUrl);
    Object.entries(params ?? {}).forEach(([key, value]) => url.searchParams.set(key, value));
    return url.toString();
  }

  private requiredConfig(key: string) {
    const value = this.config.get<string>(key);
    if (!value) {
      throw new UnauthorizedException(`${key} is not configured.`);
    }

    return value;
  }

  private get googleRedirectUri() {
    return this.config.get<string>("GOOGLE_OAUTH_REDIRECT_URI", "http://localhost:4000/auth/google/callback");
  }

  private get webAppUrl() {
    return this.config.get<string>("WEB_APP_URL", this.config.get<string>("NEXT_PUBLIC_APP_URL", "http://localhost:3000"));
  }
}
