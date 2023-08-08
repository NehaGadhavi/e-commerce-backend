import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, Matches, IsString, IsEmail } from 'class-validator';
import { DtoErrorMessage, passwordValidation } from 'src/utils/constants';

export class RegisterUserDto {
  @ApiProperty()
  @IsNotEmpty({ message: DtoErrorMessage.empty_username })
  @IsString()
  username: string;

  @ApiProperty()
  @IsNotEmpty({ message: DtoErrorMessage.empty_password })
  @IsString()
  @Matches(passwordValidation, {
    message:
      DtoErrorMessage.password,
  })
  password: string;

  @ApiProperty()
  @IsNotEmpty({ message: DtoErrorMessage.empty_email })
  @IsEmail()
  email: string;

  @ApiProperty()
  roles: string;

  @ApiProperty()
  dob: string;

  @ApiProperty()
  @IsString()
  gender: string;

  @ApiProperty()
  @IsString()
  address: string;

}

export class UpdateAdminDto extends PartialType(RegisterUserDto) {}
