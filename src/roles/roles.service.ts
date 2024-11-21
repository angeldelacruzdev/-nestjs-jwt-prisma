import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createRoleDto: CreateRoleDto) {
    try {
      return await this.prisma.role.create({ data: createRoleDto });
    } catch (error) {
      throw new InternalServerErrorException('Error creating role');
    }
  }

  async findAll() {
    try {
      return await this.prisma.role.findMany();
    } catch (error) {
      throw new InternalServerErrorException('Error fetching roles');
    }
  }

  async findOne(id: number) {
    try {
      const role = await this.prisma.role.findUnique({ where: { id } });
      if (!role) {
        throw new NotFoundException(`Role with id ${id} not found`);
      }
      return role;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error fetching role');
    }
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    try {
      return await this.prisma.role.update({
        where: { id },
        data: updateRoleDto,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Role with id ${id} not found`);
      }
      throw new InternalServerErrorException('Error updating role');
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.role.delete({ where: { id } });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Role with id ${id} not found`);
      }
      throw new InternalServerErrorException('Error deleting role');
    }
  }
}
