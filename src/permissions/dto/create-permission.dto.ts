import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsInt, IsJSON } from 'class-validator';

export class CreatePermissionDto {
    @IsInt()
    role_id: number;

    @IsString()
    @IsNotEmpty()
    action: string;

    @IsString()
    @IsNotEmpty()
    subject: string;

    @IsBoolean()
    @IsOptional()
    inverted?: boolean;

    @IsJSON()
    @IsOptional()
    conditions?: any;

    @IsString()
    @IsOptional()
    reason?: string;
}
