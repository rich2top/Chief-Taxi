"use client";

import { ArrowLeft, ArrowRight, LockKeyhole, Phone, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BrandMark } from "@/components/BrandMark";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

function googleAuthUrl() {
  return `${apiBaseUrl}/auth/google`;
}

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submitLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch(`${apiBaseUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password })
      });
      const data = (await response.json()) as { accessToken?: string; message?: string };

      if (!response.ok || !data.accessToken) {
        throw new Error(data.message ?? "Invalid login details.");
      }

      window.localStorage.setItem("leel_access_token", data.accessToken);
      setStatus("success");
      setMessage("Login successful. Opening your dashboard...");
      window.setTimeout(() => router.push("/customer"), 700);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to login.");
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

      <section className="auth-shell compact">
        <div className="auth-copy">
          <span className="eyebrow dark">
            <ShieldCheck size={15} />
            Secure access
          </span>
          <h1>Log in to your ride dashboard.</h1>
          <p>Continue booking, manage preferences, and see your active ride from one account.</p>
        </div>

        <form className="auth-card" onSubmit={submitLogin}>
          <h2>Log in</h2>
          <a className="oauth-button" href={googleAuthUrl()}>
            <span>G</span>
            Continue with Google
          </a>
          <div className="auth-divider">
            <span>or use phone/email</span>
          </div>
          <label>
            Phone or email
            <span>
              <Phone size={17} />
              <input value={identifier} onChange={(event) => setIdentifier(event.target.value)} required />
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
            {status === "loading" ? "Checking..." : "Log in"}
            <ArrowRight size={17} />
          </button>
          {message ? <p className={`form-message ${status}`}>{message}</p> : null}
          <p className="auth-small">
            New to LEEL Ride? <Link href="/signup">Create account</Link>
          </p>
        </form>
      </section>
    </main>
  );
}
