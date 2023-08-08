import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { DtoErrorMessage } from 'src/utils/constants';

export class UserLoginDto {
  @ApiProperty()
  @IsOptional()
  id: number;

  @ApiProperty()
  @IsNotEmpty({ message: DtoErrorMessage.empty_email })
  @IsString()
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: DtoErrorMessage.empty_password })
  @IsString()
  password: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  roles: string;
}
