import { Bell, Car, MapPin, Radio, ShieldAlert, SlidersHorizontal, Users } from "lucide-react";
import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";
import { MetricCard } from "@/components/MetricCard";
import { StatusPill } from "@/components/StatusPill";

const activeTrips = [
  {
    id: "LR-1042",
    customer: "Ada O.",
    driver: "Musa A.",
    route: "Wuse 2 to Jabi Lake",
    preference: "Gospel / Cooler",
    status: "Driver en route"
  },
  {
    id: "LR-1041",
    customer: "Fatima S.",
    driver: "Daniel E.",
    route: "Garki to Maitama",
    preference: "No music / Normal",
    status: "In progress"
  },
  {
    id: "LR-1040",
    customer: "John K.",
    driver: "Bala I.",
    route: "CBD to Airport Road",
    preference: "Jazz / Cooler",
    status: "Arrived"
  }
];

export default function AdminPage() {
  return (
    <main className="page">
      <header className="topbar">
        <BrandMark />
        <div className="nav-links">
          <button className="icon-button" aria-label="Alerts">
            <Bell size={18} />
          </button>
          <Link href="/customer">Customer</Link>
          <Link href="/driver">Driver</Link>
        </div>
      </header>

      <section className="content workspace">
        <aside className="sidebar" aria-label="Admin navigation">
          <Link className="active" href="/admin">
            <Radio size={17} />
            Dashboard
          </Link>
          <Link href="/admin">
            <MapPin size={17} />
            Live Trips
          </Link>
          <Link href="/admin">
            <Car size={17} />
            Vehicles
          </Link>
          <Link href="/admin">
            <Users size={17} />
            Drivers
          </Link>
          <Link href="/admin">
            <ShieldAlert size={17} />
            Safety
          </Link>
        </aside>

        <div className="stack">
          <div className="section-title">
            <div>
              <span className="eyebrow">
                <SlidersHorizontal size={15} />
                Fleet command
              </span>
              <h2>Operations Dashboard</h2>
              <p>Abuja launch control for 50 electric vehicles.</p>
            </div>
            <StatusPill tone="ready">Control center online</StatusPill>
          </div>

          <div className="metric-grid">
            <MetricCard label="Active Trips" value="18" detail="Live monitored rides" tone="gold" />
            <MetricCard label="Available Cars" value="24" detail="Ready for dispatch" tone="blue" />
            <MetricCard label="Charging" value="5" detail="Vehicles in queue" tone="slate" />
            <MetricCard label="SOS Alerts" value="0" detail="No open emergency" tone="red" />
          </div>

          <section className="panel">
            <div className="panel-header">
              <h3>Live Fleet Map</h3>
              <StatusPill tone="active">Abuja zone</StatusPill>
            </div>
            <div className="map-surface" aria-label="Live map preview">
              <span className="route-line" />
              <span className="pin one" />
              <span className="pin two" />
              <span className="vehicle-dot one">EV</span>
              <span className="vehicle-dot two">EV</span>
            </div>
          </section>

          <section className="panel">
            <div className="panel-header">
              <h3>Active Trips</h3>
              <button className="button ghost">Refresh board</button>
            </div>
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Trip</th>
                    <th>Customer</th>
                    <th>Driver</th>
                    <th>Route</th>
                    <th>Preference</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {activeTrips.map((trip) => (
                    <tr key={trip.id}>
                      <td>{trip.id}</td>
                      <td>{trip.customer}</td>
                      <td>{trip.driver}</td>
                      <td>{trip.route}</td>
                      <td>{trip.preference}</td>
                      <td>
                        <StatusPill tone="active">{trip.status}</StatusPill>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
