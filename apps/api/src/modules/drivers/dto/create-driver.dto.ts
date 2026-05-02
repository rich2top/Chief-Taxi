import { IsOptional, IsPhoneNumber, IsString, IsUUID } from "class-validator";

export class CreateDriverDto {
  @IsString()
  staffCode!: string;

  @IsString()
  fullName!: string;

  @IsPhoneNumber("NG")
  phoneNumber!: string;

  @IsOptional()
  @IsUUID()
  assignedVehicleId?: string;
}

