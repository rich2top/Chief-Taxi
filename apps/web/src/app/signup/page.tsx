"use client";

import { ArrowLeft, ArrowRight, Check, LockKeyhole, Mail, Phone, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BrandMark } from "@/components/BrandMark";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

function googleAuthUrl() {
  return `${apiBaseUrl}/auth/google`;
}

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submitSignup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch(`${apiBaseUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          phoneNumber,
          email: email || undefined,
          password
        })
      });
      const data = (await response.json()) as { accessToken?: string; message?: string };

      if (!response.ok || !data.accessToken) {
        throw new Error(data.message ?? "Unable to create account.");
      }

      window.localStorage.setItem("leel_access_token", data.accessToken);
      setStatus("success");
      setMessage("Account created. Opening your ride dashboard...");
      window.setTimeout(() => router.push("/customer"), 700);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to create account.");
    }
  }

  return (
    <main className="auth-page">
      <header className="auth-header">
        <BrandMark />
        <Link href="/" className="button glass">
          <ArrowLeft size={16} />
          Home
        </Link>
      </header>

      <section className="auth-shell">
        <div className="auth-copy">
          <span className="eyebrow dark">
            <UserRound size={15} />
            Customer account
          </span>
          <h1>Create your LEEL Ride account.</h1>
          <p>Register once, then book rides, save preferences, view trip history, and manage safety settings.</p>
          <div className="auth-proof">
            <span>
              <Check size={15} />
              Secure booking profile
            </span>
            <span>
              <Check size={15} />
              Saved music and AC preferences
            </span>
            <span>
              <Check size={15} />
              Trip records and support
            </span>
          </div>
        </div>

        <form className="auth-card" onSubmit={submitSignup}>
          <h2>Sign up</h2>
          <a className="oauth-button" href={googleAuthUrl()}>
            <span>G</span>
            Sign up with Google
          </a>
          <div className="auth-divider">
            <span>or create with details</span>
          </div>
          <label>
            Full name
            <span>
              <UserRound size={17} />
              <input value={fullName} onChange={(event) => setFullName(event.target.value)} required />
            </span>
          </label>
          <label>
            Phone number
            <span>
              <Phone size={17} />
              <input
                value={phoneNumber}
                onChange={(event) => setPhoneNumber(event.target.value)}
                placeholder="+2348012345678"
                required
              />
            </span>
          </label>
          <label>
            Email
            <span>
              <Mail size={17} />
              <input value={email} type="email" onChange={(event) => setEmail(event.target.value)} />
            </span>
          </label>
          <label>
            Password
            <span>
              <LockKeyhole size={17} />
              <input value={password} type="password" minLength={8} onChange={(event) => setPassword(event.target.value)} required />
            </span>
          </label>
          <button className="button primary wide" type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Creating account..." : "Create account"}
            <ArrowRight size={17} />
          </button>
          {message ? <p className={`form-message ${status}`}>{message}</p> : null}
          <p className="auth-small">
            Already registered? <Link href="/login">Log in</Link>
          </p>
          <p className="auth-small">
            Applying as a driver? <Link href="/driver/apply">Start driver application</Link>
          </p>
        </form>
      </section>
    </main>
  );
}
