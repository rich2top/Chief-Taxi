export type RideClassName = "Regular" | "Comfort" | "Executive";

export type RideSharePayload = {
  tripId: string;
  startedAt: string;
  pickup: string;
  destination: string;
  etaMinutes: number;
  distanceKm: number;
  fare: number;
  driverName: string;
  driverPlate: string;
  vehicle: string;
  rideClass: RideClassName;
  ac: string;
  music: string;
  musicStreamUrl?: string;
  status: string;
};

export const latestTripStorageKey = "leel.latestTrip";

const shareLimits: Record<RideClassName, number> = {
  Regular: 1,
  Comfort: 2,
  Executive: 4
};

export function getTripShareLimit(rideClass: RideClassName) {
  return shareLimits[rideClass];
}

export function createTripId() {
  return `LEEL-${Date.now().toString(36).toUpperCase().slice(-7)}`;
}

export function encodeRideSharePayload(payload: RideSharePayload) {
  const bytes = new TextEncoder().encode(JSON.stringify(payload));
  let binary = "";

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export function decodeRideSharePayload(encoded: string | null) {
  if (!encoded) {
    return null;
  }

  try {
    const normalized = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes)) as RideSharePayload;
  } catch {
    return null;
  }
}

export function buildTripShareUrl(payload: RideSharePayload, origin: string) {
  return `${origin}/trip/${payload.tripId}?d=${encodeURIComponent(encodeRideSharePayload(payload))}`;
}

export function buildTripSmsMessage(payload: RideSharePayload, shareUrl: string) {
  return `LEEL Ride ${payload.tripId}: ${payload.pickup} to ${payload.destination}. Driver ${payload.driverName}, plate ${payload.driverPlate}. ETA ${payload.etaMinutes} min. Track: ${shareUrl}`;
}

export function buildSmsHref(numbers: string[], message: string) {
  const recipients = numbers.map((number) => number.trim()).filter(Boolean).join(",");
  return `sms:${recipients}?body=${encodeURIComponent(message)}`;
}

export function getTripProgress(payload: RideSharePayload, now = Date.now()) {
  const startedAt = new Date(payload.startedAt).getTime();
  const durationMs = Math.max(payload.etaMinutes, 1) * 60 * 1000;
  const elapsed = Math.max(0, now - startedAt);
  return Math.min(96, Math.round((elapsed / durationMs) * 100));
}

export function formatTripTime(isoValue: string) {
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(isoValue));
}
