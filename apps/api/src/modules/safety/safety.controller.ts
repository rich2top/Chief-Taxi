import { Body, Controller, Get, Post } from "@nestjs/common";
import { CreateSosEventDto } from "./dto/create-sos-event.dto";
import { SafetyService } from "./safety.service";

@Controller("safety")
export class SafetyController {
  constructor(private readonly safetyService: SafetyService) {}

  @Post("sos")
  createSos(@Body() input: CreateSosEventDto) {
    return this.safetyService.createSos(input);
  }

  @Get("sos")
  findOpen() {
    return this.safetyService.findOpen();
  }
}

