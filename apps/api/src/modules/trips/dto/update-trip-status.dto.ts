import { IsEnum } from "class-validator";
import { TripStatus } from "../../../common/enums/domain.enum";

export class UpdateTripStatusDto {
  @IsEnum(TripStatus)
  status!: TripStatus;
}

