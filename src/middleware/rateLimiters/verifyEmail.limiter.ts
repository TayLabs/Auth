import redisClient from '@/config/redis/client';
import env from '@/types/env';
import rateLimit from 'express-rate-limit';
import RedisStore, { type RedisReply } from 'rate-limit-redis';

export const verifyEmailLimiter =
  env.NODE_ENV === 'production'
    ? rateLimit({
        windowMs: 2 * 60 * 1000,
        limit: 1,
        standardHeaders: 'draft-8',
        skipFailedRequests: true,
        legacyHeaders: false,
        ipv6Subnet: 56,
        store: new RedisStore({
          sendCommand: async (command: string, ...args: string[]) =>
            (await redisClient.call(command, ...args)) as RedisReply,
          prefix: 'rl:verify-email:',
        }),
      })
    : undefined;
