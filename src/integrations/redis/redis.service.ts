import { Inject, Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);

  constructor(
    @Inject('REDIS_CLIENT')
    private readonly redis: Redis,
  ) {}

  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await this.redis.get(key);
      if (!data) return null;
      return JSON.parse(data) as T;
    } catch (err) {
      this.logger.error(`Redis GET error: ${key}`, err);
      return null;
    }
  }

  async set(key: string, value: any, ttl = 60) {
    try {
      await this.redis.set(key, JSON.stringify(value), 'EX', ttl);
    } catch (err) {
      this.logger.error(`Redis SET error: ${key}`, err);
    }
  }

  async del(keys: string | string[]): Promise<number> {
    const arr = Array.isArray(keys) ? keys : [keys];
    return this.redis.del(...arr);
  }

  async delPattern(pattern: string) {
    const keys = await this.redis.keys(pattern);

    if (keys.length) {
      await this.redis.del(...keys);
    }
  }
}
