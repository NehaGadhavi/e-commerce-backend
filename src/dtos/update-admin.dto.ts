import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Matches, IsString, IsEmail } from "class-validator";

export class UpdateAdminDto {
    @ApiProperty()
    username: string;
    
    @ApiProperty()
    @IsString()
    @Matches(/(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).*$/, {
      message: "Password must contain 8-10 characters, Password must include numbers."
    })
    password: string;

    @ApiProperty()
    @IsEmail()
    email: string;
  
    @ApiProperty()
    roles: string;

    @ApiProperty()
    dob: Date;

    @ApiProperty()
    gender: string;

    @ApiProperty()
    address: string;

  }