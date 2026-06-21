import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { InventoryService } from '../services/inventory.service';

import { CreateInventoryDto } from '../dto/create-inventory.dto';
import { UpdateInventoryDto } from '../dto/update-inventory.dto';
import { Roles } from 'src/core/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
import { RolesGuard } from 'src/core/guards/roles.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Inventory')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  @ApiOperation({
    summary: 'Create inventory',
  })
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateInventoryDto) {
    return this.inventoryService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all inventory',
  })
  @Roles(Role.ADMIN)
  findAll() {
    return this.inventoryService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get inventory by id',
  })
  @Roles(Role.ADMIN)
  findOne(@Param('id') id: string) {
    return this.inventoryService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update inventory',
  })
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateInventoryDto) {
    return this.inventoryService.update(id, dto);
  }
}
