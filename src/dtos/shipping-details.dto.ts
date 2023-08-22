import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";
import { DtoErrorMessage } from "../utils/constants";

export class ShippingDetailsDto{
    @ApiProperty()
    id: number;

    @ApiProperty()
    @IsNotEmpty({ message: DtoErrorMessage.empty_name })
    name: string;

    // @ApiProperty()
    // @IsNotEmpty({ message: DtoErrorMessage.empty_lastName })
    // last_name: string;

    @ApiProperty()
    @IsNotEmpty({ message: DtoErrorMessage.empty_email })
    email: string;

    @ApiProperty()
    @IsNotEmpty({ message: DtoErrorMessage.empty_address })
    address: string;

    // @ApiProperty()
    // @IsNotEmpty({ message: DtoErrorMessage.empty_addressLine2 })
    // address_line2: string;

    @ApiProperty()
    @IsNotEmpty({ message: DtoErrorMessage.empty_city })
    city: string;

    // @ApiProperty()
    // @IsNotEmpty({ message: DtoErrorMessage.empty_zipPostal })
    // zip_postal: string;

    @ApiProperty()
    @IsNotEmpty({ message: DtoErrorMessage.empty_country })
    country: string;

    @ApiProperty()
    @IsNotEmpty({ message: DtoErrorMessage.empty_pinCode })
    pin_code: string;

    @ApiProperty()
    @IsOptional()
    bought_by: number;

    @ApiProperty()
    @IsOptional()
    $isCalledFromCart?: boolean;
}