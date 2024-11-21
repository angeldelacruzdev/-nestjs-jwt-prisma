import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PermissionsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createPermissionDto: CreatePermissionDto) {
    try {
      return await this.prisma.permission.create({ data: createPermissionDto });
    } catch (error) {
      console.error('Error creating permission:', error);
      throw new InternalServerErrorException('Could not create permission');
    }
  }

  async findAll() {
    try {
      return await this.prisma.permission.findMany();
    } catch (error) {
      console.error('Error fetching permissions:', error);
      throw new InternalServerErrorException('Could not fetch permissions');
    }
  }

  async findOne(id: number) {
    try {
      const permission = await this.prisma.permission.findUnique({ where: { id } });
      if (!permission) throw new NotFoundException(`Permission with id ${id} not found`);
      return permission;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error; // Propagate NotFoundException
      }
      console.error('Error fetching permission:', error);
      throw new InternalServerErrorException('Could not fetch permission');
    }
  }

  async update(id: number, updatePermissionDto: UpdatePermissionDto) {
    try {
      const updatedPermission = await this.prisma.permission.update({
        where: { id },
        data: updatePermissionDto,
      });
      return updatedPermission;
    } catch (error) {
      console.error('Error updating permission:', error);
      if (error.code === 'P2025') {
        throw new NotFoundException(`Permission with id ${id} not found`);
      }
      throw new InternalServerErrorException('Could not update permission');
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.permission.delete({ where: { id } });
    } catch (error) {
      console.error('Error deleting permission:', error);
      if (error.code === 'P2025') {
        throw new NotFoundException(`Permission with id ${id} not found`);
      }
      throw new InternalServerErrorException('Could not delete permission');
    }
  }
}
