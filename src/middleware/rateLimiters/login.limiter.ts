import redisClient from '@/config/redis/client';
import rateLimit from 'express-rate-limit';
import RedisStore, { type RedisReply } from 'rate-limit-redis';

export const loginRateLimit = rateLimit({
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
});

export const signUpRateLimit = rateLimit({
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
});

export const refreshRateLimit = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 5,
	standardHeaders: 'draft-8',
	legacyHeaders: false,
	ipv6Subnet: 56,
	store: new RedisStore({
		sendCommand: async (command: string, ...args: string[]) =>
			(await redisClient.call(command, ...args)) as RedisReply,
		prefix: 'rl:refresh:',
	}),
});
