import { IsNotEmpty } from 'class-validator';

export class UserLoginDto {
  id: number;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;

  roles: string;
}
