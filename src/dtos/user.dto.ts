import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  Matches,
  IsString,
  IsEmail,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { DtoErrorMessage, passwordValidation } from '../utils/constants';
import { GenderCategory, UserRoles } from '../utils/enums';

export class RegisterUserDto {
  @ApiProperty()
  @IsNotEmpty({ message: DtoErrorMessage.empty_username })
  @IsString()
  username: string;

  @ApiProperty()
  @IsNotEmpty({ message: DtoErrorMessage.empty_password })
  @IsString()
  @Matches(passwordValidation, {
    message: DtoErrorMessage.password,
  })
  password: string;

  @ApiProperty()
  @IsNotEmpty({ message: DtoErrorMessage.empty_email })
  @IsEmail()
  email: string;

  @ApiProperty()
  roles: UserRoles;

  @ApiProperty()
  dob: string;

  @ApiProperty()
  gender: GenderCategory;

  @ApiProperty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  total_purchase: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  total_payment: number;
}

export class UpdateAdminDto extends PartialType(RegisterUserDto) {}
