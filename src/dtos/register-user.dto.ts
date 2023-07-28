import { IsNotEmpty, MinLength, MaxLength, Matches, IsString, IsEmail } from "class-validator";

export class RegisterUserDto {
    @IsNotEmpty()
    username: string;
    
    @IsNotEmpty()
    @IsString()
    @Matches(/(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).*$/, {
      message: "Password must contain 8-10 characters, Password must include numbers."
    })
    password: string;

    // @IsNotEmpty()
    // @IsString()
    // @Matches(/(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).*$/, {
    //   message: "Confirm password must contain 8-10 characters, Confirm password must include numbers."
    // })
    // confirm_password: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;
  
    roles: string;

    items_purchased: number;

    total_payment: number;
  }