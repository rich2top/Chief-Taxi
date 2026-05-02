"use client";

import { LoaderCircle, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { BrandMark } from "@/components/BrandMark";

function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("Completing secure Google sign-in...");
  const [status, setStatus] = useState<"loading" | "error">("loading");

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const accessToken = hashParams.get("access_token");
    const error = searchParams.get("googleError");

    if (accessToken) {
      window.localStorage.setItem("leel_access_token", accessToken);
      window.history.replaceState(null, "", "/auth/google/callback");
      setMessage("Google sign-in complete. Opening your dashboard...");
      window.setTimeout(() => router.replace("/customer"), 600);
      return;
    }

    setStatus("error");
    setMessage(error ?? "Google sign-in could not be completed. Please try again.");
  }, [router, searchParams]);

  return (
    <main className="auth-page callback-page">
      <section className="auth-callback-card">
        <BrandMark />
        <div className="auth-callback-icon">
          {status === "loading" ? <LoaderCircle size={22} className="spin" /> : <ShieldCheck size={22} />}
        </div>
        <h1>{status === "loading" ? "Signing you in" : "Sign-in needs attention"}</h1>
        <p>{message}</p>
        {status === "error" ? (
          <Link className="button primary wide" href="/login">
            Back to login
          </Link>
        ) : null}
      </section>
    </main>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={null}>
      <GoogleCallbackContent />
    </Suspense>
  );
}
