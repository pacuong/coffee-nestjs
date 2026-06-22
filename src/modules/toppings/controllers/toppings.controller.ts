import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { Role } from '@prisma/client';

import { FileInterceptor } from '@nestjs/platform-express';

import { ToppingsService } from '../services/toppings.service';

import { CreateToppingDto } from '../dto/create-topping.dto';
import { UpdateToppingDto } from '../dto/update-topping.dto';

import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
import { RolesGuard } from 'src/core/guards/roles.guard';
import { Roles } from 'src/core/decorators/roles.decorator';

import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Toppings')
@Controller('toppings')
export class ToppingsController {
  constructor(private readonly toppingsService: ToppingsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({
    summary: 'Create topping',
  })
  create(
    @Body() dto: CreateToppingDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.toppingsService.create(dto, file);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all toppings',
  })
  findAll() {
    return this.toppingsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get topping by id',
  })
  findOne(@Param('id') id: string) {
    return this.toppingsService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({
    summary: 'Update topping',
  })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateToppingDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.toppingsService.update(id, dto, file);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Delete topping',
  })
  remove(@Param('id') id: string) {
    return this.toppingsService.remove(id);
  }
}
