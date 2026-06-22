import { Injectable } from '@nestjs/common';

import { StatisticsRepository } from '../repositories/statistics.repository';
import { RedisService } from 'src/integrations/redis/redis.service';
import { SocketService } from 'src/integrations/socket/socket.service';

@Injectable()
export class StatisticsService {
  constructor(
    private readonly statisticsRepo: StatisticsRepository,
    private readonly redis: RedisService,
    private readonly socketService: SocketService,
  ) {}

  async overview() {
    const cacheKey = 'stats:overview';

    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    const [
      totalUsers,
      totalOrders,
      pendingOrders,
      completedOrders,
      revenue,
      revenueToday,
    ] = await Promise.all([
      this.statisticsRepo.countUsers(),
      this.statisticsRepo.countOrders(),
      this.statisticsRepo.countPendingOrders(),
      this.statisticsRepo.countCompletedOrders(),
      this.statisticsRepo.totalRevenue(),
      this.statisticsRepo.revenueToday(),
    ]);

    const result = {
      totalUsers,
      totalOrders,
      pendingOrders,
      completedOrders,
      totalRevenue: Number(revenue._sum.totalAmount ?? 0),
      revenueToday: Number(revenueToday._sum.totalAmount ?? 0),
    };

    await this.redis.set(cacheKey, result, 30);

    return result;
  }

  async revenueByDay() {
    const cacheKey = 'stats:revenue-by-day';

    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    const result = await this.statisticsRepo.revenueByDay();

    const mapped = result.map((item) => ({
      date: item.date,
      revenue: Number(item.revenue?.toString() ?? 0),
    }));

    await this.redis.set(cacheKey, mapped, 60);

    return mapped;
  }

  async emitDashboardUpdate() {
    const [overview, revenueByDay] = await Promise.all([
      this.overview(),
      this.revenueByDay(),
    ]);

    this.socketService.emitDashboardUpdated({
      overview,
      revenueByDay,
    });
  }
}
