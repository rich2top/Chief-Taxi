import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsInt,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Max,
  Min
} from "class-validator";

export class CreateDriverApplicationDto {
  @IsString()
  fullName!: string;

  @IsPhoneNumber("NG")
  phoneNumber!: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  city!: string;

  @IsString()
  address!: string;

  @IsString()
  licenseNumber!: string;

  @IsDateString()
  licenseExpiry!: string;

  @IsInt()
  @Min(0)
  @Max(50)
  yearsExperience!: number;

  @IsBoolean()
  hasEvExperience!: boolean;

  @IsOptional()
  @IsString()
  previousEmployer?: string;

  @IsString()
  guarantorName!: string;

  @IsPhoneNumber("NG")
  guarantorPhoneNumber!: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
