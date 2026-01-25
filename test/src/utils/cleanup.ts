import redisClient from '@/config/redis/client';
import { pool } from '@/config/db/index';

export const closeConnections = async () => {
	await Promise.all([redisClient.quit(), pool.end()]);
};
