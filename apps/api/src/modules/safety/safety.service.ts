import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateSosEventDto } from "./dto/create-sos-event.dto";
import { SosEventEntity } from "./sos-event.entity";

@Injectable()
export class SafetyService {
  constructor(
    @InjectRepository(SosEventEntity)
    private readonly sosEvents: Repository<SosEventEntity>
  ) {}

  createSos(input: CreateSosEventDto) {
    return this.sosEvents.save(this.sosEvents.create(input));
  }

  findOpen() {
    return this.sosEvents.find({
      order: { createdAt: "DESC" },
      take: 50
    });
  }
}

