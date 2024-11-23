import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, Query, Put, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';

import { Prisma } from '@prisma/client';
import { checkAbilites } from '../casls/decorators/abilities.decorator';
import { AbilitiesGuard } from '../casls/guards/abilities.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) { }


  @checkAbilites({ action: 'create', subject: 'User' })
  @UseGuards(AbilitiesGuard)
  @Post()
  async createUser(@Body() data: Prisma.UserCreateInput) {
    try {
      return await this.userService.createUser(data);
    } catch (error) {
      throw new HttpException(error.message, error.getStatus());
    }
  }


  @checkAbilites({ action: 'read', subject: 'User' })
  @UseGuards(AbilitiesGuard)
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


  @checkAbilites({ action: 'read', subject: 'User' })
  @UseGuards(AbilitiesGuard)
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    try {
      return await this.userService.getUserById(Number(id));
    } catch (error) {
      throw new HttpException(error.message, error.getStatus());
    }
  }

  @checkAbilites({ action: 'update', subject: 'User' })
  @UseGuards(AbilitiesGuard)
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


  @checkAbilites({ action: 'delete', subject: 'User' })
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    try {
      return await this.userService.deleteUser(Number(id));
    } catch (error) {
      throw new HttpException(error.message, error.getStatus());
    }
  }
}
