import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateVehicleDto } from "./dto/create-vehicle.dto";
import { VehicleEntity } from "./vehicle.entity";

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(VehicleEntity)
    private readonly vehicles: Repository<VehicleEntity>
  ) {}

  create(input: CreateVehicleDto) {
    return this.vehicles.save(this.vehicles.create(input));
  }

  findAll() {
    return this.vehicles.find({
      order: { createdAt: "DESC" },
      take: 100
    });
  }

  async findById(id: string) {
    const vehicle = await this.vehicles.findOne({ where: { id } });
    if (!vehicle) {
      throw new NotFoundException("Vehicle not found.");
    }

    return vehicle;
  }
}

