import { IsIn, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateSosEventDto {
  @IsUUID()
  tripId!: string;

  @IsUUID()
  raisedByUserId!: string;

  @IsIn(["customer", "driver", "staff"])
  raisedByType!: "customer" | "driver" | "staff";

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsString()
  note?: string;
}

