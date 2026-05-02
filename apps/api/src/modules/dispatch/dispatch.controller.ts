import { Body, Controller, Post } from "@nestjs/common";
import { DispatchService } from "./dispatch.service";
import { AssignBookingDto } from "./dto/assign-booking.dto";

@Controller("dispatch")
export class DispatchController {
  constructor(private readonly dispatchService: DispatchService) {}

  @Post("assign")
  assignBooking(@Body() input: AssignBookingDto) {
    return this.dispatchService.assignBooking(input);
  }
}

