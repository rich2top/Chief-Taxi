import { IsEmail, IsOptional, IsPhoneNumber, IsString, MinLength } from "class-validator";

export class RegisterDto {
  @IsString()
  fullName!: string;

  @IsPhoneNumber("NG")
  phoneNumber!: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  @MinLength(8)
  password!: string;
}

