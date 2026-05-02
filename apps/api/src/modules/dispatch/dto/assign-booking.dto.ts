import { IsUUID } from "class-validator";

export class AssignBookingDto {
  @IsUUID()
  bookingId!: string;

  @IsUUID()
  driverId!: string;

  @IsUUID()
  vehicleId!: string;
}

