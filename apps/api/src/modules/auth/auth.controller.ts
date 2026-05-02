import { Body, Controller, Get, Post, Query, Redirect } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  register(@Body() input: RegisterDto) {
    return this.authService.register(input);
  }

  @Post("login")
  login(@Body() input: LoginDto) {
    return this.authService.login(input);
  }

  @Get("google")
  @Redirect(undefined, 302)
  google(@Query("returnTo") returnTo?: string) {
    return {
      url: this.authService.buildGoogleAuthUrl(returnTo)
    };
  }

  @Get("google/callback")
  @Redirect(undefined, 302)
  async googleCallback(
    @Query("code") code?: string,
    @Query("state") state?: string,
    @Query("error") error?: string
  ) {
    return {
      url: await this.authService.handleGoogleCallback({ code, state, error })
    };
  }
}
