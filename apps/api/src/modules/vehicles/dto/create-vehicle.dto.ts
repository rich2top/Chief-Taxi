import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from "class-validator";
import { RideClass, VehicleStatus } from "../../../common/enums/domain.enum";

export class CreateVehicleDto {
  @IsString()
  manufacturer!: string;

  @IsString()
  model!: string;

  @IsString()
  plateNumber!: string;

  @IsOptional()
  @IsString()
  vin?: string;

  @IsEnum(RideClass)
  rideClass!: RideClass;

  @IsOptional()
  @IsEnum(VehicleStatus)
  status?: VehicleStatus;

  @IsOptional()
  @IsInt()
  @Min(0)
  mileageKm?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  batteryPercent?: number;
}

