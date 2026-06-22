import { Controller, Get, UseGuards } from '@nestjs/common';

import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Role } from '@prisma/client';

import { Roles } from 'src/core/decorators/roles.decorator';

import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
import { RolesGuard } from 'src/core/guards/roles.guard';

import { StatisticsService } from '../services/statistics.service';

@ApiTags('Statistics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('overview')
  @ApiOperation({
    summary: 'Dashboard overview',
  })
  overview() {
    return this.statisticsService.overview();
  }

  @Get('revenue')
  @ApiOperation({
    summary: 'Revenue by day',
  })
  revenueByDay() {
    return this.statisticsService.revenueByDay();
  }
}
