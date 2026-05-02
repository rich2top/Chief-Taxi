import { Module } from "@nestjs/common";
import { BookingsModule } from "../bookings/bookings.module";
import { DriversModule } from "../drivers/drivers.module";
import { TripsModule } from "../trips/trips.module";
import { VehiclesModule } from "../vehicles/vehicles.module";
import { DispatchController } from "./dispatch.controller";
import { DispatchService } from "./dispatch.service";

@Module({
  imports: [BookingsModule, DriversModule, VehiclesModule, TripsModule],
  controllers: [DispatchController],
  providers: [DispatchService]
})
export class DispatchModule {}

