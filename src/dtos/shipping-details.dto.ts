import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";
import { DtoErrorMessage } from "src/utils/constants";

export class ShippingDetailsDto{
    @ApiProperty()
    id: number;

    @ApiProperty()
    @IsNotEmpty({ message: DtoErrorMessage.empty_firstName })
    first_name: string;

    @ApiProperty()
    @IsNotEmpty({ message: DtoErrorMessage.empty_lastName })
    last_name: string;

    @ApiProperty()
    @IsNotEmpty({ message: DtoErrorMessage.empty_email })
    email: string;

    @ApiProperty()
    @IsNotEmpty({ message: DtoErrorMessage.empty_addressLine1 })
    address_line1: string;

    @ApiProperty()
    @IsNotEmpty({ message: DtoErrorMessage.empty_addressLine2 })
    address_line2: string;

    @ApiProperty()
    @IsNotEmpty({ message: DtoErrorMessage.empty_city })
    city: string;

    @ApiProperty()
    @IsNotEmpty({ message: DtoErrorMessage.empty_zipPostal })
    zip_postal: string;

    @ApiProperty()
    @IsNotEmpty({ message: DtoErrorMessage.empty_country })
    country: string;

    @ApiProperty()
    @IsNotEmpty({ message: DtoErrorMessage.empty_zipCode })
    zip_code: string;

    @ApiProperty()
    @IsOptional()
    bought_by: number;
}