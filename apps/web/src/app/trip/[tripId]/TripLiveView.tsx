"use client";

import { ArrowLeft, CarFront, Clock3, MapPin, Navigation, ShieldCheck, Snowflake, Volume2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BrandMark } from "@/components/BrandMark";
import {
  decodeRideSharePayload,
  formatTripTime,
  getTripProgress,
  type RideSharePayload
} from "@/lib/trip-share";

type TripLiveViewProps = {
  encodedPayload: string | null;
  tripId: string;
};

const fallbackTrip: RideSharePayload = {
  tripId: "LEEL-LIVE",
  startedAt: "2026-05-06T20:00:00.000Z",
  pickup: "Pickup hidden",
  destination: "Destination hidden",
  etaMinutes: 1,
  distanceKm: 0,
  fare: 0,
  driverName: "LEEL Driver",
  driverPlate: "Pending",
  vehicle: "LEEL EV",
  rideClass: "Regular",
  ac: "Cool",
  music: "Ride sound",
  status: "Trip details unavailable"
};

export function TripLiveView({ encodedPayload, tripId }: TripLiveViewProps) {
  const trip = useMemo(() => decodeRideSharePayload(encodedPayload) ?? { ...fallbackTrip, tripId }, [encodedPayload, tripId]);
  const [progress, setProgress] = useState(() => getTripProgress(trip));

  useEffect(() => {
    const timer = window.setInterval(() => {
      setProgress(getTripProgress(trip));
    }, 15000);

    return () => window.clearInterval(timer);
  }, [trip]);

  return (
    <main className="trip-live-page">
      <header className="trip-live-header">
        <Link className="ride-icon-button" href="/customer" aria-label="Back to booking">
          <ArrowLeft size={20} />
        </Link>
        <BrandMark />
        <span className="ride-live-pill map-ready">
          <span />
          Live trip
        </span>
      </header>

      <section className="trip-live-shell">
        <div className="trip-live-hero">
          <span>
            <ShieldCheck size={18} />
            {trip.status}
          </span>
          <h1>{trip.tripId}</h1>
          <p>
            {trip.driverName} • {trip.driverPlate} • {trip.vehicle}
          </p>
        </div>

        <div className="trip-progress-panel">
          <div className="trip-progress-top">
            <span>{progress}% progress</span>
            <strong>{trip.etaMinutes} min ETA</strong>
          </div>
          <div className="trip-progress-track" aria-hidden="true">
            <span style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="trip-live-route">
          <div>
            <MapPin size={18} />
            <span>
              <strong>Started</strong>
              <small>{trip.pickup}</small>
            </span>
          </div>
          <div>
            <Navigation size={18} />
            <span>
              <strong>Destination</strong>
              <small>{trip.destination}</small>
            </span>
          </div>
        </div>

        <div className="trip-live-grid">
          <span>
            <Clock3 size={17} />
            {formatTripTime(trip.startedAt)}
          </span>
          <span>
            <CarFront size={17} />
            {trip.rideClass}
          </span>
          <span>
            <Snowflake size={17} />
            {trip.ac} AC
          </span>
          <span>
            <Volume2 size={17} />
            {trip.music}
          </span>
        </div>
      </section>
    </main>
  );
}
