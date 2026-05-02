import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CreateDriverApplicationDto } from "./dto/create-driver-application.dto";
import { CreateDriverDto } from "./dto/create-driver.dto";
import { DriversService } from "./drivers.service";

@Controller("drivers")
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Post("applications")
  createApplication(@Body() input: CreateDriverApplicationDto) {
    return this.driversService.createApplication(input);
  }

  @Post()
  create(@Body() input: CreateDriverDto) {
    return this.driversService.create(input);
  }

  @Get("applications")
  findApplications() {
    return this.driversService.findApplications();
  }

  @Get()
  findAll() {
    return this.driversService.findAll();
  }

  @Get(":id")
  findById(@Param("id") id: string) {
    return this.driversService.findById(id);
  }
}
