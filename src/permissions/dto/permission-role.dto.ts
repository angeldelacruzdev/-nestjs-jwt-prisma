import { IsNotEmpty, IsNumber } from 'class-validator';

export class PermissionRoleDto {
  @IsNumber()
  @IsNotEmpty()
  roleId: number;

  @IsNotEmpty()
  @IsNumber()
  permissionId: number;
}
