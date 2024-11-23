import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

  constructor(private readonly prismaService: PrismaService) { }


  async createUser(data: CreateUserDto): Promise<User> {
    try {

      const saltOrRounds = 10;
      const hash = await bcrypt.hash(data.password, saltOrRounds);


      return await this.prismaService.user.create({
        data: {
          ...data,
          role_id: 2,
          password: hash
        },
        include: { role: true, Profile: true },
      });
    } catch (error) {
      throw new HttpException(
        'Error al crear el usuario: ' + error.message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Obtener todos los usuarios con paginación
  async getUsers(
    page: number,
    limit: number,
  ): Promise<{ data: User[]; total: number }> {
    try {
      const skip = (page - 1) * limit;
      const total = await this.prismaService.user.count();
      const data = await this.prismaService.user.findMany({
        skip,
        take: limit,
        include: { role: true, Profile: true },
      });
      return { data, total };
    } catch (error) {
      throw new HttpException(
        'Error al obtener usuarios: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Obtener un usuario por ID
  async getUserById(id: number): Promise<User | null> {
    try {
      return await this.prismaService.user.findUnique({
        where: { id },
        include: { role: true, Profile: true },
      });
    } catch (error) {
      throw new HttpException(
        'Error al obtener el usuario: ' + error.message,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  // Actualizar un usuario, su rol o su perfil
  async updateUser(
    id: number,
    data: Prisma.UserUpdateInput,
  ): Promise<User> {
    try {
      return await this.prismaService.user.update({
        where: { id },
        data,
        include: { role: true, Profile: true },
      });
    } catch (error) {
      throw new HttpException(
        'Error al actualizar el usuario: ' + error.message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Eliminar un usuario
  async deleteUser(id: number): Promise<User> {
    try {
      return await this.prismaService.user.delete({
        where: { id },
      });
    } catch (error) {
      throw new HttpException(
        'Error al eliminar el usuario: ' + error.message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}