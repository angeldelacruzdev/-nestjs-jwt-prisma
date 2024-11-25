import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { checkAbilites } from '../casls/decorators/abilities.decorator';
import { AbilitiesGuard } from '../casls/guards/abilities.guard';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) { }

  @checkAbilites({ action: 'update', subject: 'Role' })
  @UseGuards(AbilitiesGuard)
  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }


  @checkAbilites({ action: 'read', subject: 'Role' })
  @UseGuards(AbilitiesGuard)
  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  @checkAbilites({ action: 'read', subject: 'Role' })
  @UseGuards(AbilitiesGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(+id);
  }


  @checkAbilites({ action: 'update', subject: 'Role' })
  @UseGuards(AbilitiesGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(+id, updateRoleDto);
  }


  @checkAbilites({ action: 'delete', subject: 'Role' })
  @UseGuards(AbilitiesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(+id);
  }
}
