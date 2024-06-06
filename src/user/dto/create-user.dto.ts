import { IsString, IsEmail, MinLength, IsOptional, IsDateString } from "class-validator";

export class CreateUserDTO {

    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(3)
    password: string;

    @IsOptional()
    @IsDateString()
    birthAt: string;
}
