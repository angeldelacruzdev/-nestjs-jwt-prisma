import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    @IsStrongPassword({ minLowercase: 1, minSymbols: 1, minUppercase: 1, minNumbers: 1, minLength: 10 })
    password: string

    @IsNotEmpty()
    @IsString()
    name: string;
}
