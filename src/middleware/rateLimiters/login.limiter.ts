import redisClient from '@/config/redis/client';
import env from '@/types/env';
import type { RequestHandler } from 'express';
import rateLimit from 'express-rate-limit';
import RedisStore, { type RedisReply } from 'rate-limit-redis';

export const loginRateLimit =
  env.NODE_ENV === 'production'
    ? rateLimit({
        windowMs: 5 * 60 * 1000,
        limit: 5,
        skipSuccessfulRequests: true,
        standardHeaders: 'draft-8',
        legacyHeaders: false,
        ipv6Subnet: 56,
        store: new RedisStore({
          sendCommand: async (command: string, ...args: string[]) =>
            (await redisClient.call(command, ...args)) as RedisReply,
          prefix: 'rl:login:',
        }),
      })
    : (((_req, _res, next) => next()) as RequestHandler);

export const signUpRateLimit =
  env.NODE_ENV === 'production'
    ? rateLimit({
        windowMs: 15 * 60 * 1000,
        limit: 2,
        skipFailedRequests: true,
        standardHeaders: 'draft-8',
        legacyHeaders: false,
        ipv6Subnet: 56,
        store: new RedisStore({
          sendCommand: async (command: string, ...args: string[]) =>
            (await redisClient.call(command, ...args)) as RedisReply,
          prefix: 'rl:signup:',
        }),
      })
    : (((_req, _res, next) => next()) as RequestHandler);

export const refreshRateLimit =
  env.NODE_ENV === 'production'
    ? rateLimit({
        windowMs: 15 * 60 * 1000,
        limit: 5,
        skipFailedRequests: true,
        standardHeaders: 'draft-8',
        legacyHeaders: false,
        ipv6Subnet: 56,
        store: new RedisStore({
          sendCommand: async (command: string, ...args: string[]) =>
            (await redisClient.call(command, ...args)) as RedisReply,
          prefix: 'rl:refresh:',
        }),
      })
    : (((_req, _res, next) => next()) as RequestHandler);
