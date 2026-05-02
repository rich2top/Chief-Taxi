export const brand = {
  name: "LEEL Ride",
  tagline: "Your ride, your control.",
  market: "Abuja",
  company: "LEEL EV Mobility",
  colors: {
    primary: "#FFC400",
    charcoal: "#0B1020",
    background: "#F5F6F8",
    amber: "#F59E0B",
    blue: "#2F6BFF",
    danger: "#DC2626",
    success: "#16A34A"
  }
} as const;

export enum UserRole {
  Customer = "customer",
  Driver = "driver",
  Dispatch = "dispatch",
  Support = "support",
  Fleet = "fleet",
  Finance = "finance",
  Admin = "admin",
  SuperAdmin = "super_admin"
}

export enum RideClass {
  Regular = "regular",
  Comfort = "comfort",
  Vip = "vip"
}

export enum TripStatus {
  Requested = "requested",
  Assigned = "assigned",
  DriverEnRoute = "driver_en_route",
  Arrived = "arrived",
  InProgress = "in_progress",
  Waiting = "waiting",
  Completed = "completed",
  Cancelled = "cancelled",
  UnderReview = "under_review"
}

export enum VehicleStatus {
  Available = "available",
  Assigned = "assigned",
  OnTrip = "on_trip",
  Charging = "charging",
  Cleaning = "cleaning",
  Maintenance = "maintenance",
  OutOfService = "out_of_service",
  Retired = "retired"
}

export type RidePreference = {
  music: "afrobeats" | "gospel" | "jazz" | "rnb" | "instrumental" | "no_music";
  ac: "cooler" | "normal" | "warmer" | "off";
  rideStyle: "quiet" | "conversation_ok";
};

export type LocationPoint = {
  label: string;
  latitude: number;
  longitude: number;
};
