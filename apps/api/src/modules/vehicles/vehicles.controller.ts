import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CreateVehicleDto } from "./dto/create-vehicle.dto";
import { VehiclesService } from "./vehicles.service";

@Controller("vehicles")
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  create(@Body() input: CreateVehicleDto) {
    return this.vehiclesService.create(input);
  }

  @Get()
  findAll() {
    return this.vehiclesService.findAll();
  }

  @Get(":id")
  findById(@Param("id") id: string) {
    return this.vehiclesService.findById(id);
  }
}

