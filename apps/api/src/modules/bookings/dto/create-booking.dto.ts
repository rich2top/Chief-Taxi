import { IsEnum, IsIn, IsInt, IsNumber, IsOptional, IsString, IsUUID, Min } from "class-validator";
import { RideClass } from "../../../common/enums/domain.enum";

export class CreateBookingDto {
  @IsUUID()
  customerId!: string;

  @IsString()
  pickupLabel!: string;

  @IsNumber()
  pickupLatitude!: number;

  @IsNumber()
  pickupLongitude!: number;

  @IsString()
  destinationLabel!: string;

  @IsNumber()
  destinationLatitude!: number;

  @IsNumber()
  destinationLongitude!: number;

  @IsEnum(RideClass)
  rideClass!: RideClass;

  @IsIn(["afrobeats", "gospel", "jazz", "rnb", "instrumental", "no_music"])
  musicPreference!: string;

  @IsIn(["cooler", "normal", "warmer", "off"])
  acPreference!: string;

  @IsIn(["quiet", "conversation_ok"])
  rideStyle!: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  estimatedFareKobo?: number;
}

