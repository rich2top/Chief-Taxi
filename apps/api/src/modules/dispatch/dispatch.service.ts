import { Injectable } from "@nestjs/common";
import { BookingsService } from "../bookings/bookings.service";
import { DriversService } from "../drivers/drivers.service";
import { TripsService } from "../trips/trips.service";
import { VehiclesService } from "../vehicles/vehicles.service";
import { AssignBookingDto } from "./dto/assign-booking.dto";

@Injectable()
export class DispatchService {
  constructor(
    private readonly bookingsService: BookingsService,
    private readonly driversService: DriversService,
    private readonly vehiclesService: VehiclesService,
    private readonly tripsService: TripsService
  ) {}

  async assignBooking(input: AssignBookingDto) {
    const [booking] = await Promise.all([
      this.bookingsService.findById(input.bookingId),
      this.driversService.findById(input.driverId),
      this.vehiclesService.findById(input.vehicleId)
    ]);

    await this.bookingsService.markAssigned(input.bookingId);

    return this.tripsService.createFromBooking({
      booking,
      driverId: input.driverId,
      vehicleId: input.vehicleId
    });
  }
}

