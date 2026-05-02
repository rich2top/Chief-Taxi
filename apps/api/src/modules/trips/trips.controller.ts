import { Body, Controller, Get, Param, Patch } from "@nestjs/common";
import { UpdateTripStatusDto } from "./dto/update-trip-status.dto";
import { TripsService } from "./trips.service";

@Controller("trips")
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Get("live")
  findLive() {
    return this.tripsService.findLive();
  }

  @Get(":id")
  findById(@Param("id") id: string) {
    return this.tripsService.findById(id);
  }

  @Patch(":id/status")
  updateStatus(@Param("id") id: string, @Body() input: UpdateTripStatusDto) {
    return this.tripsService.updateStatus(id, input.status);
  }
}

