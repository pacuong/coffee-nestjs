import { Injectable } from '@nestjs/common';

import { StatisticsRepository } from '../repositories/statistics.repository';

@Injectable()
export class StatisticsService {
  constructor(private readonly statisticsRepo: StatisticsRepository) {}

  async overview() {
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

    return {
      totalUsers,
      totalOrders,
      pendingOrders,
      completedOrders,
      totalRevenue: Number(revenue._sum.totalAmount ?? 0),
      revenueToday: Number(revenueToday._sum.totalAmount ?? 0),
    };
  }

  async revenueByDay() {
    const result = await this.statisticsRepo.revenueByDay();

    return result.map((item) => ({
      date: item.date,
      revenue: item.revenue ? Number(item.revenue.toString()) : 0,
    }));
  }
}
