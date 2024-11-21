import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsInt, IsJSON } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreatePermissionDto } from './create-permission.dto';

export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {
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
