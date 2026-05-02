import { CheckCircle2, MapPinned, MessageCircle, Navigation, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";
import { StatusPill } from "@/components/StatusPill";

export default function DriverPage() {
  return (
    <main className="page">
      <header className="topbar">
        <BrandMark />
        <nav className="nav-links" aria-label="Driver navigation">
          <Link href="/admin">Admin</Link>
          <Link href="/customer">Customer</Link>
          <Link href="/driver/apply">Apply</Link>
        </nav>
      </header>

      <section className="driver-screen stack">
        <div className="section-title">
          <div>
            <span className="eyebrow">
              <Navigation size={15} />
              Employee console
            </span>
            <h2>Driver Console</h2>
            <p>Company device view for assigned employee drivers.</p>
          </div>
          <StatusPill tone="active">On duty</StatusPill>
        </div>

        <section className="driver-panel">
          <div className="driver-strip">
            <h3>Assigned Trip</h3>
            <StatusPill tone="warning">Arrive in 6 min</StatusPill>
          </div>

          <div className="driver-body">
            <div className="trip-list">
              <div className="trip-item">
                <span>
                  <strong>Customer</strong>
                  <small>Ada O.</small>
                </span>
                <CheckCircle2 size={20} />
              </div>
              <div className="trip-item">
                <span>
                  <strong>Pickup</strong>
                  <small>Wuse 2, Abuja</small>
                </span>
                <MapPinned size={20} />
              </div>
              <div className="trip-item">
                <span>
                  <strong>Destination</strong>
                  <small>Jabi Lake Mall</small>
                </span>
                <MapPinned size={20} />
              </div>
              <div className="trip-item">
                <span>
                  <strong>Preferences</strong>
                  <small>Gospel music / Cooler AC / Quiet ride</small>
                </span>
                <MessageCircle size={20} />
              </div>
            </div>

            <div className="driver-actions">
              <button className="button primary" type="button">Arrived</button>
              <button className="button dark" type="button">Start Trip</button>
              <button className="button" type="button">Message Dispatch</button>
              <button className="button danger" type="button">
                <ShieldAlert size={18} />
                SOS
              </button>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
