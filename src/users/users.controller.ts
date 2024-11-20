import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, Query, Put } from '@nestjs/common';
import { UsersService } from './users.service';

import { Prisma } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) { }

  @Post()
  async createUser(@Body() data: Prisma.UserCreateInput) {
    try {
      return await this.userService.createUser(data);
    } catch (error) {
      throw new HttpException(error.message, error.getStatus());
    }
  }

  @Get()
  async getUsers(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    try {
      return await this.userService.getUsers(
        parseInt(page.toString(), 10),
        parseInt(limit.toString(), 10),
      );
    } catch (error) {
      throw new HttpException(error.message, error.getStatus());
    }
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    try {
      return await this.userService.getUserById(Number(id));
    } catch (error) {
      throw new HttpException(error.message, error.getStatus());
    }
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() data: Prisma.UserUpdateInput,
  ) {
    try {
      return await this.userService.updateUser(Number(id), data);
    } catch (error) {
      throw new HttpException(error.message, error.getStatus());
    }
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    try {
      return await this.userService.deleteUser(Number(id));
    } catch (error) {
      throw new HttpException(error.message, error.getStatus());
    }
  }
}
