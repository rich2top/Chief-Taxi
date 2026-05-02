"use client";

import { ArrowLeft, ArrowRight, BriefcaseBusiness, CarFront, Check, Mail, Phone, UserRound } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { BrandMark } from "@/components/BrandMark";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export default function DriverApplyPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submitApplication(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const form = new FormData(event.currentTarget);
    const payload = {
      fullName: String(form.get("fullName") ?? ""),
      phoneNumber: String(form.get("phoneNumber") ?? ""),
      email: String(form.get("email") ?? "") || undefined,
      city: String(form.get("city") ?? ""),
      address: String(form.get("address") ?? ""),
      licenseNumber: String(form.get("licenseNumber") ?? ""),
      licenseExpiry: String(form.get("licenseExpiry") ?? ""),
      yearsExperience: Number(form.get("yearsExperience") ?? 0),
      hasEvExperience: form.get("hasEvExperience") === "on",
      previousEmployer: String(form.get("previousEmployer") ?? "") || undefined,
      guarantorName: String(form.get("guarantorName") ?? ""),
      guarantorPhoneNumber: String(form.get("guarantorPhoneNumber") ?? ""),
      notes: String(form.get("notes") ?? "") || undefined
    };

    try {
      const response = await fetch(`${apiBaseUrl}/drivers/applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = (await response.json()) as { id?: string; message?: string };

      if (!response.ok || !data.id) {
        throw new Error(data.message ?? "Unable to submit application.");
      }

      setStatus("success");
      setMessage("Application submitted. LEEL Ride operations will review it before onboarding.");
      event.currentTarget.reset();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to submit application.");
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

      <section className="auth-shell driver-application-shell">
        <div className="auth-copy">
          <span className="eyebrow dark">
            <CarFront size={15} />
            Driver application
          </span>
          <h1>Apply to drive with LEEL Ride.</h1>
          <p>
            This is an application, not instant driver access. Operations reviews license details,
            guarantor details, background checks, and EV readiness before approval.
          </p>
          <div className="auth-proof">
            <span>
              <Check size={15} />
              License verification
            </span>
            <span>
              <Check size={15} />
              Guarantor details
            </span>
            <span>
              <Check size={15} />
              EV training readiness
            </span>
          </div>
        </div>

        <form className="auth-card driver-application-card" onSubmit={submitApplication}>
          <h2>Application details</h2>
          <div className="auth-form-grid">
            <label>
              Full name
              <span>
                <UserRound size={17} />
                <input name="fullName" required />
              </span>
            </label>
            <label>
              Phone number
              <span>
                <Phone size={17} />
                <input name="phoneNumber" placeholder="+2348012345678" required />
              </span>
            </label>
            <label>
              Email
              <span>
                <Mail size={17} />
                <input name="email" type="email" />
              </span>
            </label>
            <label>
              City
              <span>
                <BriefcaseBusiness size={17} />
                <input name="city" defaultValue="Abuja" required />
              </span>
            </label>
            <label className="span-two">
              Residential address
              <span>
                <BriefcaseBusiness size={17} />
                <input name="address" required />
              </span>
            </label>
            <label>
              License number
              <span>
                <CarFront size={17} />
                <input name="licenseNumber" required />
              </span>
            </label>
            <label>
              License expiry
              <span>
                <CarFront size={17} />
                <input name="licenseExpiry" type="date" required />
              </span>
            </label>
            <label>
              Years driving
              <span>
                <CarFront size={17} />
                <input name="yearsExperience" type="number" min="0" max="50" defaultValue="3" required />
              </span>
            </label>
            <label>
              Previous employer
              <span>
                <BriefcaseBusiness size={17} />
                <input name="previousEmployer" />
              </span>
            </label>
            <label>
              Guarantor name
              <span>
                <UserRound size={17} />
                <input name="guarantorName" required />
              </span>
            </label>
            <label>
              Guarantor phone
              <span>
                <Phone size={17} />
                <input name="guarantorPhoneNumber" placeholder="+2348012345678" required />
              </span>
            </label>
            <label className="driver-check span-two">
              <input name="hasEvExperience" type="checkbox" />
              <span>I have driven or maintained electric vehicles before</span>
            </label>
            <label className="span-two">
              Notes
              <textarea name="notes" placeholder="Availability, preferred area, or additional information" />
            </label>
          </div>
          <button className="button primary wide" type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Submitting..." : "Submit application"}
            <ArrowRight size={17} />
          </button>
          {message ? <p className={`form-message ${status}`}>{message}</p> : null}
        </form>
      </section>
    </main>
  );
}
