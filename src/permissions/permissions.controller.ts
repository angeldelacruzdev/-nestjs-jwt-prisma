import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { checkAbilites } from '../casls/decorators/abilities.decorator';
import { AbilitiesGuard } from '../casls/guards/abilities.guard';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) { }


  @checkAbilites({ action: 'create', subject: 'Permission' })
  @UseGuards(AbilitiesGuard)
  @Post()
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionsService.create(createPermissionDto);
  }



  @checkAbilites({ action: 'read', subject: 'Permission' })
  @UseGuards(AbilitiesGuard)
  @Get()
  findAll() {
    return this.permissionsService.findAll();
  }


  @checkAbilites({ action: 'read', subject: 'Permission' })
  @UseGuards(AbilitiesGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(+id);
  }


  @checkAbilites({ action: 'update', subject: 'Permission' })
  @UseGuards(AbilitiesGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto) {
    return this.permissionsService.update(+id, updatePermissionDto);
  }


  @checkAbilites({ action: 'delete', subject: 'Permission' })
  @UseGuards(AbilitiesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.permissionsService.remove(+id);
  }
}
