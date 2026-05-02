import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { DriverApplicationEntity } from "./driver-application.entity";
import { CreateDriverApplicationDto } from "./dto/create-driver-application.dto";
import { CreateDriverDto } from "./dto/create-driver.dto";
import { DriverEntity } from "./driver.entity";

@Injectable()
export class DriversService {
  constructor(
    @InjectRepository(DriverEntity)
    private readonly drivers: Repository<DriverEntity>,
    @InjectRepository(DriverApplicationEntity)
    private readonly driverApplications: Repository<DriverApplicationEntity>
  ) {}

  create(input: CreateDriverDto) {
    return this.drivers.save(this.drivers.create(input));
  }

  findAll() {
    return this.drivers.find({
      order: { createdAt: "DESC" },
      take: 100
    });
  }

  async findById(id: string) {
    const driver = await this.drivers.findOne({ where: { id } });
    if (!driver) {
      throw new NotFoundException("Driver not found.");
    }

    return driver;
  }

  createApplication(input: CreateDriverApplicationDto) {
    return this.driverApplications.save(this.driverApplications.create(input));
  }

  findApplications() {
    return this.driverApplications.find({
      order: { createdAt: "DESC" },
      take: 100
    });
  }
}
