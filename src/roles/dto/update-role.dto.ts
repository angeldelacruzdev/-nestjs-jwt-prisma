import { IsString, IsOptional, IsDate } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateRoleDto } from './create-role.dto';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsDate()
    updated_at?: Date;
}
