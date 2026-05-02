import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SosEventEntity } from "./sos-event.entity";
import { SafetyController } from "./safety.controller";
import { SafetyService } from "./safety.service";

@Module({
  imports: [TypeOrmModule.forFeature([SosEventEntity])],
  controllers: [SafetyController],
  providers: [SafetyService]
})
export class SafetyModule {}

