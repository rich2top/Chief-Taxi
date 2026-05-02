import { IsBoolean, IsEnum, IsIn, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";
import { RideClass } from "../../../common/enums/domain.enum";

export class CreatePriceQuoteDto {
  @IsString()
  pickupLabel!: string;

  @IsString()
  destinationLabel!: string;

  @IsNumber()
  pickupLatitude!: number;

  @IsNumber()
  pickupLongitude!: number;

  @IsNumber()
  destinationLatitude!: number;

  @IsNumber()
  destinationLongitude!: number;

  @IsEnum(RideClass)
  rideClass!: RideClass;

  @IsIn(["now", "schedule", "hourly", "airport"])
  bookingType!: "now" | "schedule" | "hourly" | "airport";

  @IsOptional()
  @IsString()
  scheduledAt?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(180)
  waitMinutes?: number;

  @IsOptional()
  @IsBoolean()
  femaleDriver?: boolean;
}
