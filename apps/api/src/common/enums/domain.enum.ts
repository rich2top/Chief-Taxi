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

export enum BookingStatus {
  Requested = "requested",
  Assigned = "assigned",
  Cancelled = "cancelled",
  Completed = "completed"
}

export enum TripStatus {
  Assigned = "assigned",
  DriverEnRoute = "driver_en_route",
  Arrived = "arrived",
  InProgress = "in_progress",
  Waiting = "waiting",
  Completed = "completed",
  Cancelled = "cancelled",
  UnderReview = "under_review"
}

export enum SosStatus {
  Open = "open",
  Acknowledged = "acknowledged",
  Resolved = "resolved"
}

export enum DriverApplicationStatus {
  Submitted = "submitted",
  Screening = "screening",
  Interview = "interview",
  Approved = "approved",
  Rejected = "rejected"
}
