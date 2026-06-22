import { Module, Global } from '@nestjs/common';
import { RedisService } from 'src/integrations/redis/redis.service';
import { redisClient } from 'src/config/redis.config';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useValue: redisClient,
    },
    RedisService,
  ],
  exports: [RedisService],
})
export class RedisModule {}
