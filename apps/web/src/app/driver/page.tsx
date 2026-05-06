"use client";

import {
  CheckCircle2,
  MapPinned,
  MessageCircle,
  Music,
  Navigation,
  ShieldAlert,
  Snowflake,
  UserRound
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BrandMark } from "@/components/BrandMark";
import { StatusPill } from "@/components/StatusPill";
import { latestTripStorageKey, type RideSharePayload } from "@/lib/trip-share";

const fallbackTrip: RideSharePayload = {
  tripId: "LEEL-DEMO",
  startedAt: new Date().toISOString(),
  pickup: "Wuse 2, Abuja",
  destination: "Nnamdi Azikiwe Airport",
  etaMinutes: 8,
  distanceKm: 31.6,
  fare: 23098,
  driverName: "Daniel E.",
  driverPlate: "ABJ-024EV",
  vehicle: "Aion i60 EV",
  rideClass: "Comfort",
  ac: "Cool",
  music: "Afrobeats Ride",
  status: "Assigned"
};

export default function DriverPage() {
  const [trip, setTrip] = useState<RideSharePayload>(fallbackTrip);

  useEffect(() => {
    const readTrip = () => {
      const storedTrip = window.localStorage.getItem(latestTripStorageKey);

      if (!storedTrip) {
        return;
      }

      try {
        setTrip(JSON.parse(storedTrip) as RideSharePayload);
      } catch {
        setTrip(fallbackTrip);
      }
    };

    readTrip();
    window.addEventListener("storage", readTrip);

    return () => window.removeEventListener("storage", readTrip);
  }, []);

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
            <StatusPill tone="warning">{`Arrive in ${trip.etaMinutes} min`}</StatusPill>
          </div>

          <div className="driver-body">
            <div className="trip-list">
              <div className="trip-item">
                <span>
                  <strong>Trip</strong>
                  <small>
                    {trip.tripId} • {trip.rideClass}
                  </small>
                </span>
                <CheckCircle2 size={20} />
              </div>
              <div className="trip-item">
                <span>
                  <strong>Pickup</strong>
                  <small>{trip.pickup}</small>
                </span>
                <MapPinned size={20} />
              </div>
              <div className="trip-item">
                <span>
                  <strong>Destination</strong>
                  <small>{trip.destination}</small>
                </span>
                <MapPinned size={20} />
              </div>
              <div className="trip-item">
                <span>
                  <strong>Vehicle</strong>
                  <small>
                    {trip.vehicle} • {trip.driverPlate}
                  </small>
                </span>
                <UserRound size={20} />
              </div>
            </div>

            <div className="driver-preference-board">
              <div>
                <Snowflake size={20} />
                <span>
                  <strong>{trip.ac} AC</strong>
                  <small>Set cabin before pickup</small>
                </span>
              </div>
              <div>
                <Music size={20} />
                <span>
                  <strong>{trip.music}</strong>
                  <small>Rider-selected ride sound</small>
                </span>
              </div>
              <div>
                <MessageCircle size={20} />
                <span>
                  <strong>{trip.status}</strong>
                  <small>Preference visible to driver</small>
                </span>
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
