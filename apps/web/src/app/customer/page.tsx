"use client";

import {
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  CarFront,
  Check,
  ChevronDown,
  Clock3,
  Headphones,
  MapPin,
  Music,
  Navigation,
  Search,
  ShieldAlert,
  ShieldCheck,
  SlidersHorizontal,
  Snowflake,
  Sparkles,
  UserRound,
  WalletCards,
  type LucideIcon
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { BrandMark } from "@/components/BrandMark";

const rideClasses = [
  {
    name: "Regular",
    label: "Everyday EV",
    car: "Aion Y Plus",
    baseFare: 1800,
    perKm: 320,
    perMinute: 70,
    minimumFare: 3500,
    eta: 6,
    detail: "Clean electric ride with route sharing, AC, and music preset."
  },
  {
    name: "Comfort",
    label: "Executive EV",
    car: "Aion i60",
    baseFare: 2600,
    perKm: 430,
    perMinute: 90,
    minimumFare: 5500,
    eta: 8,
    detail: "More space, quieter cabin, water-ready service, and priority comfort."
  },
  {
    name: "VIP",
    label: "Premium EV",
    car: "Aion V",
    baseFare: 5000,
    perKm: 760,
    perMinute: 130,
    minimumFare: 11000,
    eta: 12,
    detail: "Premium SUV experience for airport, executives, events, and long rides."
  }
] as const;

const bookingTypes = ["Now", "Schedule", "Hourly", "Airport"] as const;
const acOptions = ["Cooler", "Normal", "Warmer", "Off"] as const;
const waitOptions = ["None", "10 min", "20 min", "30 min", "60 min"] as const;
const musicSources = ["Spotify", "YouTube Music"] as const;

const knownPlaces = [
  { label: "Wuse 2, Abuja", lat: 9.081, lng: 7.468 },
  { label: "Central Business District, Abuja", lat: 9.0579, lng: 7.4951 },
  { label: "Garki Area 11, Abuja", lat: 9.0305, lng: 7.4898 },
  { label: "Maitama, Abuja", lat: 9.0965, lng: 7.4942 },
  { label: "Asokoro, Abuja", lat: 9.0455, lng: 7.5241 },
  { label: "Jabi Lake Mall", lat: 9.0757, lng: 7.4255 },
  { label: "Utako, Abuja", lat: 9.069, lng: 7.445 },
  { label: "Nnamdi Azikiwe Airport", lat: 9.0068, lng: 7.2632 },
  { label: "Transcorp Hilton Abuja", lat: 9.0765, lng: 7.4957 },
  { label: "Novare Gateway Mall", lat: 9.0308, lng: 7.3969 }
] as const;

const routePresets = [
  ["Wuse 2, Abuja", "Nnamdi Azikiwe Airport"],
  ["Maitama, Abuja", "Jabi Lake Mall"],
  ["Central Business District, Abuja", "Transcorp Hilton Abuja"]
] as const;

const musicCatalog = [
  { title: "Calm Afrobeats Ride", artist: "LEEL Mix", source: "Spotify", category: "Afrobeats" },
  { title: "Gospel Morning Drive", artist: "LEEL Mix", source: "YouTube Music", category: "Gospel" },
  { title: "Executive Jazz Cabin", artist: "LEEL Mix", source: "Spotify", category: "Jazz" },
  { title: "Quiet R&B Evening", artist: "LEEL Mix", source: "Spotify", category: "R&B" },
  { title: "Instrumental Focus", artist: "LEEL Mix", source: "YouTube Music", category: "Instrumental" },
  { title: "Passenger Selected Track", artist: "Search Spotify or YouTube Music", source: "Spotify", category: "Search" }
] as const;

type RideClass = (typeof rideClasses)[number]["name"];
type BookingType = (typeof bookingTypes)[number];
type AcOption = (typeof acOptions)[number];
type WaitOption = (typeof waitOptions)[number];
type MusicSource = (typeof musicSources)[number];
type MusicTrack = {
  title: string;
  artist: string;
  source: MusicSource;
  category: string;
};

type ChoiceMenuProps<T extends string> = {
  label: string;
  icon: LucideIcon;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
};

function formatNaira(value: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0
  }).format(value);
}

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function resolvePlace(query: string) {
  const cleanQuery = normalize(query);
  const exact = knownPlaces.find((place) => normalize(place.label) === cleanQuery);
  const partial = knownPlaces.find(
    (place) => normalize(place.label).includes(cleanQuery) || cleanQuery.includes(normalize(place.label))
  );
  const match = exact ?? partial;

  if (match) {
    return { ...match, known: true };
  }

  const seed = Array.from(cleanQuery || "abuja").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return {
    label: query || "Abuja",
    lat: 9.0579 + ((seed % 23) - 11) / 1000,
    lng: 7.4951 + ((seed % 31) - 15) / 1000,
    known: false
  };
}

function distanceKmBetween(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const earthRadiusKm = 6371;
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const latDelta = toRadians(b.lat - a.lat);
  const lngDelta = toRadians(b.lng - a.lng);
  const startLat = toRadians(a.lat);
  const endLat = toRadians(b.lat);
  const haversine =
    Math.sin(latDelta / 2) ** 2 + Math.cos(startLat) * Math.cos(endLat) * Math.sin(lngDelta / 2) ** 2;
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

function estimateRoute(pickup: string, destination: string) {
  const origin = resolvePlace(pickup);
  const target = resolvePlace(destination);
  const directKm = distanceKmBetween(origin, target);
  const roadDistanceKm = Math.max(1.8, directKm * 1.32);
  const durationMinutes = Math.max(8, Math.round((roadDistanceKm / 28) * 60 + 6));

  return {
    distanceKm: Number(roadDistanceKm.toFixed(1)),
    durationMinutes,
    confidence: origin.known && target.known ? "Known Abuja route" : "Prototype estimate"
  };
}

function waitMinutesFromOption(option: WaitOption) {
  return option === "None" ? 0 : Number.parseInt(option, 10);
}

function ChoiceMenu<T extends string>({ label, icon: Icon, value, options, onChange }: ChoiceMenuProps<T>) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`choice-menu ${open ? "open" : ""}`}>
      <span className="choice-label">
        <Icon size={16} />
        {label}
      </span>
      <button type="button" className="choice-trigger" aria-expanded={open} onClick={() => setOpen((next) => !next)}>
        {value}
        <ChevronDown size={16} />
      </button>
      {open ? (
        <div className="choice-list" role="listbox">
          {options.map((option) => (
            <button
              className={value === option ? "selected" : ""}
              key={option}
              type="button"
              role="option"
              aria-selected={value === option}
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
            >
              {option}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function CustomerPage() {
  const [pickup, setPickup] = useState("Wuse 2, Abuja");
  const [destination, setDestination] = useState("Nnamdi Azikiwe Airport");
  const [rideClass, setRideClass] = useState<RideClass>("Comfort");
  const [bookingType, setBookingType] = useState<BookingType>("Now");
  const [scheduleDate, setScheduleDate] = useState("2026-05-03");
  const [scheduleTime, setScheduleTime] = useState("09:30");
  const [ac, setAc] = useState<AcOption>("Cooler");
  const [waitTime, setWaitTime] = useState<WaitOption>("None");
  const [femaleDriver, setFemaleDriver] = useState(false);
  const [quietRide, setQuietRide] = useState(false);
  const [shareTrip, setShareTrip] = useState(true);
  const [musicSource, setMusicSource] = useState<MusicSource>("Spotify");
  const [musicQuery, setMusicQuery] = useState("");
  const [selectedTrack, setSelectedTrack] = useState<MusicTrack>(musicCatalog[1]);
  const [confirmed, setConfirmed] = useState(false);

  const selectedClass = useMemo(
    () => rideClasses.find((item) => item.name === rideClass) ?? rideClasses[1],
    [rideClass]
  );

  const route = useMemo(() => estimateRoute(pickup, destination), [pickup, destination]);
  const musicResults = useMemo(() => {
    const query = normalize(musicQuery);
    const matches = musicCatalog.filter((track) => {
      const sourceMatches = track.source === musicSource || track.category === "Search";
      const queryMatches = !query || normalize(`${track.title} ${track.artist} ${track.category}`).includes(query);
      return sourceMatches && queryMatches;
    });

    if (!query || matches.length > 0) {
      return matches;
    }

    return [
      {
        title: musicQuery,
        artist: `Search ${musicSource} catalog`,
        source: musicSource,
        category: "Search"
      },
      {
        title: `${musicQuery} playlist`,
        artist: `${musicSource} recommendations`,
        source: musicSource,
        category: "Search"
      }
    ] satisfies MusicTrack[];
  }, [musicQuery, musicSource]);

  const estimate = useMemo(() => {
    const rawFare =
      selectedClass.baseFare +
      route.distanceKm * selectedClass.perKm +
      route.durationMinutes * selectedClass.perMinute;
    const bookingAddOn = bookingType === "Hourly" ? 7000 : bookingType === "Airport" ? 3000 : 0;
    const waitAddOn = waitMinutesFromOption(waitTime) * 120;
    const driverAddOn = femaleDriver ? 1200 : 0;
    const securityFee = 250;
    return Math.ceil(Math.max(selectedClass.minimumFare, rawFare) + bookingAddOn + waitAddOn + driverAddOn + securityFee);
  }, [bookingType, femaleDriver, route.distanceKm, route.durationMinutes, selectedClass, waitTime]);

  const eta = selectedClass.eta + (femaleDriver ? 3 : 0);
  const bookingCode = `${rideClass.slice(0, 1)}${bookingType.slice(0, 1)}-${eta}${Math.round(route.distanceKm)}`.toUpperCase();
  const qrCells = useMemo(
    () =>
      Array.from({ length: 64 }, (_, index) => {
        const char = bookingCode.charCodeAt(index % bookingCode.length);
        return index < 8 || index % 8 === 0 || (char + index * 11) % 5 === 0;
      }),
    [bookingCode]
  );

  const scheduleLabel =
    bookingType === "Now" ? "Immediate pickup" : `${bookingType} • ${scheduleDate} at ${scheduleTime}`;
  const musicLabel = quietRide ? "Quiet ride" : `${selectedTrack.title} • ${selectedTrack.source}`;

  return (
    <main className="booking-page">
      <header className="booking-glass-header">
        <BrandMark />
        <nav className="booking-nav" aria-label="Customer navigation">
          <Link href="/">
            <ArrowLeft size={16} />
            Home
          </Link>
          <Link href="/admin">Admin</Link>
          <Link href="/driver">Driver</Link>
        </nav>
      </header>

      <div className="booking-stage">
        <section className="booking-hero-panel">
          <Image
            src="/images/fleet/aion-y-road-clean.jpg"
            alt="LEEL Ride electric vehicle on the road"
            fill
            priority
            sizes="100vw"
          />
          <div className="booking-hero-shade" />
          <div className="booking-hero-copy">
            <span className="eyebrow dark">
              <Sparkles size={15} />
              Book a ride
            </span>
            <h1>Set your ride before pickup.</h1>
            <p>
              Choose the vehicle class, route, music, AC, wait time, and safety preferences before
              the driver arrives.
            </p>
            <div className="booking-hero-strip" aria-label="Booking highlights">
              <span>
                <Clock3 size={16} />
                Live ETA
              </span>
              <span>
                <SlidersHorizontal size={16} />
                Cabin control
              </span>
              <span>
                <ShieldCheck size={16} />
                Server-priced fare
              </span>
            </div>
          </div>
          <div className="booking-hero-mini">
            <span>{route.distanceKm} km estimated route</span>
            <strong>{selectedClass.car}</strong>
            <small>{eta} min pickup • {route.durationMinutes} min trip</small>
          </div>
        </section>

        <section className="booking-workspace">
          <form
            className="booking-form-panel"
            onSubmit={(event) => {
              event.preventDefault();
              setConfirmed(true);
            }}
          >
            <div className="booking-panel-heading">
              <span>Step 1</span>
              <div>
                <h2>Trip details</h2>
                <p>Route pricing updates from distance, duration, and booking type.</p>
              </div>
            </div>

            <div className="booking-route-grid">
              <label className="booking-field">
                <span>Pickup</span>
                <div>
                  <MapPin size={18} />
                  <input
                    value={pickup}
                    onChange={(event) => {
                      setPickup(event.target.value);
                      setConfirmed(false);
                    }}
                  />
                </div>
              </label>
              <label className="booking-field">
                <span>Destination</span>
                <div>
                  <Navigation size={18} />
                  <input
                    value={destination}
                    onChange={(event) => {
                      setDestination(event.target.value);
                      setConfirmed(false);
                    }}
                  />
                </div>
              </label>
            </div>

            <div className="route-presets" aria-label="Popular routes">
              {routePresets.map(([from, to]) => (
                <button
                  key={`${from}-${to}`}
                  type="button"
                  onClick={() => {
                    setPickup(from);
                    setDestination(to);
                    setConfirmed(false);
                  }}
                >
                  {from.split(",")[0]} → {to.split(",")[0]}
                </button>
              ))}
            </div>

            <div className="route-intelligence">
              <span>
                <Navigation size={16} />
                {route.distanceKm} km
              </span>
              <span>
                <Clock3 size={16} />
                {route.durationMinutes} min
              </span>
              <span>
                <WalletCards size={16} />
                {formatNaira(estimate)}
              </span>
              <small>{route.confidence}; Google Routes API will replace this estimator when keys are added.</small>
            </div>

            <div className="booking-choice-row" aria-label="Booking type">
              {bookingTypes.map((type) => (
                <button
                  className={`booking-pill ${bookingType === type ? "active" : ""}`}
                  key={type}
                  type="button"
                  onClick={() => {
                    setBookingType(type);
                    setConfirmed(false);
                  }}
                >
                  {type === "Schedule" ? <CalendarClock size={16} /> : <Clock3 size={16} />}
                  {type}
                </button>
              ))}
            </div>

            {bookingType !== "Now" ? (
              <div className="schedule-grid">
                <label className="booking-field">
                  <span>Pickup date</span>
                  <div>
                    <CalendarClock size={18} />
                    <input type="date" value={scheduleDate} onChange={(event) => setScheduleDate(event.target.value)} />
                  </div>
                </label>
                <label className="booking-field">
                  <span>Pickup time</span>
                  <div>
                    <Clock3 size={18} />
                    <input type="time" value={scheduleTime} onChange={(event) => setScheduleTime(event.target.value)} />
                  </div>
                </label>
              </div>
            ) : null}

            <div className="booking-panel-heading compact">
              <span>Step 2</span>
              <div>
                <h2>Ride class</h2>
                <p>Pick the cabin standard for this trip.</p>
              </div>
            </div>

            <div className="ride-class-grid">
              {rideClasses.map((option) => {
                const classFare = Math.ceil(
                  Math.max(
                    option.minimumFare,
                    option.baseFare + route.distanceKm * option.perKm + route.durationMinutes * option.perMinute
                  )
                );

                return (
                  <button
                    className={`ride-class-card ${rideClass === option.name ? "active" : ""}`}
                    key={option.name}
                    type="button"
                    onClick={() => {
                      setRideClass(option.name);
                      setConfirmed(false);
                    }}
                  >
                    <span>{option.label}</span>
                    <strong>{option.name}</strong>
                    <small>{option.detail}</small>
                    <em>{formatNaira(classFare)} route est.</em>
                  </button>
                );
              })}
            </div>

            <div className="booking-panel-heading compact">
              <span>Step 3</span>
              <div>
                <h2>Passenger preferences</h2>
                <p>Make the cabin feel right before the car arrives.</p>
              </div>
            </div>

            <div className="preference-grid">
              <ChoiceMenu label="AC" icon={Snowflake} value={ac} options={acOptions} onChange={setAc} />
              <ChoiceMenu label="Wait time" icon={Clock3} value={waitTime} options={waitOptions} onChange={setWaitTime} />
            </div>

            <div className="music-search-card">
              <div className="music-search-top">
                <span>
                  <Headphones size={16} />
                  Music search
                </span>
                <div>
                  {musicSources.map((source) => (
                    <button
                      className={musicSource === source ? "active" : ""}
                      key={source}
                      type="button"
                      onClick={() => setMusicSource(source)}
                    >
                      {source}
                    </button>
                  ))}
                </div>
              </div>
              <label className="music-input">
                <Search size={17} />
                <input
                  placeholder="Search track, artist, genre, playlist"
                  value={musicQuery}
                  onChange={(event) => setMusicQuery(event.target.value)}
                />
              </label>
              <div className="music-results" role="listbox">
                {musicResults.map((track) => (
                  <button
                    className={selectedTrack.title === track.title && selectedTrack.source === track.source ? "active" : ""}
                    key={`${track.source}-${track.title}`}
                    type="button"
                    onClick={() => {
                      setSelectedTrack(track);
                      setQuietRide(false);
                      setConfirmed(false);
                    }}
                  >
                    <span>
                      <strong>{track.title}</strong>
                      <small>{track.artist}</small>
                    </span>
                    <em>{track.source}</em>
                  </button>
                ))}
              </div>
            </div>

            <div className="booking-switches">
              <label>
                <input
                  checked={femaleDriver}
                  type="checkbox"
                  onChange={(event) => {
                    setFemaleDriver(event.target.checked);
                    setConfirmed(false);
                  }}
                />
                <span>
                  <UserRound size={16} />
                  Request female driver
                </span>
              </label>
              <label>
                <input
                  checked={quietRide}
                  type="checkbox"
                  onChange={(event) => {
                    setQuietRide(event.target.checked);
                    setConfirmed(false);
                  }}
                />
                <span>
                  <Music size={16} />
                  Quiet ride
                </span>
              </label>
              <label>
                <input checked={shareTrip} type="checkbox" onChange={(event) => setShareTrip(event.target.checked)} />
                <span>
                  <ShieldCheck size={16} />
                  Share trip
                </span>
              </label>
            </div>

            <button className="button primary booking-submit" type="submit">
              <CarFront size={18} />
              Confirm ride request
              <ArrowRight size={18} />
            </button>
          </form>

          <aside className="booking-summary-panel" aria-label="Ride summary">
            <div className="summary-map" aria-hidden="true">
              <span className="summary-route" />
              <span className="summary-pin start" />
              <span className="summary-pin end" />
              <span className="summary-car">
                <CarFront size={15} />
              </span>
            </div>

            <div className="summary-main">
              <span>{selectedClass.label}</span>
              <h2>{selectedClass.car}</h2>
              <p>
                {pickup} to {destination}
              </p>
            </div>

            <div className="summary-metrics">
              <div>
                <span>Distance</span>
                <strong>{route.distanceKm} km</strong>
              </div>
              <div>
                <span>Duration</span>
                <strong>{route.durationMinutes} min</strong>
              </div>
              <div>
                <span>Pickup ETA</span>
                <strong>{eta} min</strong>
              </div>
              <div>
                <span>Estimate</span>
                <strong>{formatNaira(estimate)}</strong>
              </div>
            </div>

            <div className="summary-list">
              <span>
                <CalendarClock size={16} />
                {scheduleLabel}
              </span>
              <span>
                <Music size={16} />
                {musicLabel}
              </span>
              <span>
                <Snowflake size={16} />
                {ac} AC
              </span>
              <span>
                <Clock3 size={16} />
                {waitTime === "None" ? "No wait time" : `${waitTime} wait`}
              </span>
              <span>
                <ShieldCheck size={16} />
                {shareTrip ? "Trip sharing on" : "Trip sharing off"}
              </span>
            </div>

            <div className={`booking-confirmation ${confirmed ? "active" : ""}`}>
              <div>
                <Check size={17} />
                <span>{confirmed ? "Ride request ready" : "Review before confirming"}</span>
              </div>
              <strong>{bookingCode}</strong>
              <small>Fare quote should be reissued by the backend and expire before payment.</small>
              <div className="booking-qr" aria-label="Booking QR preview">
                {qrCells.map((filled, index) => (
                  <span className={filled ? "filled" : ""} key={`${bookingCode}-${index}`} />
                ))}
              </div>
            </div>

            <div className="summary-actions">
              <button className="button danger wide" type="button">
                <ShieldAlert size={18} />
                SOS
              </button>
              <button className="button dark wide" type="button">
                <WalletCards size={18} />
                Pay with card or MoMo
              </button>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
