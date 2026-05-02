import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DriverApplicationEntity } from "./driver-application.entity";
import { DriverEntity } from "./driver.entity";
import { DriversController } from "./drivers.controller";
import { DriversService } from "./drivers.service";

@Module({
  imports: [TypeOrmModule.forFeature([DriverEntity, DriverApplicationEntity])],
  controllers: [DriversController],
  providers: [DriversService],
  exports: [DriversService]
})
export class DriversModule {}
