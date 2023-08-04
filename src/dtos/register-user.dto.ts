import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Matches, IsString, IsEmail } from "class-validator";

export class RegisterUserDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    username: string;
    
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @Matches(/(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).*$/, {
      message: "Password must contain 8-10 characters, Password must include numbers."
    })
    password: string;

    @ApiProperty()
    @IsNotEmpty()
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