import cron from 'node-cron';
import Redis from 'ioredis';

// Runs every hour at :00
cron.schedule('0 * * * *', async () => {
	const redisClient = new Redis({
		host: process.env.REDIS_URI!,
		port: parseInt(process.env.REDIS_PORT!),
		maxRetriesPerRequest: 3,
	});

	redisClient.on('connect', () => {
		console.log('📻 Connected to Redis');
	});

	redisClient.on('error', (err) => {
		console.error('🛑 Redis connection error:', err);
		redisClient.quit(); // Prevents multiple connection attempts
		process.exit(1);
	});

	// Check if other instance is running before executing
	const lockKey = 'refresh-token-cleanup-lock';
	const lockTTL = 60 * 60; // 1 hour

	const gotLock = await redisClient.set(lockKey, '1', 'EX', lockTTL);

	if (!gotLock) return; // Another instance is running this job

	console.log('Running stale token cleanup job...');

	let cursor = '0';
	do {
		// Use SCAN—never KEYS—in production
		const [nextCursor, keys] = await redisClient.scan(
			cursor,
			'MATCH',
			'user:*:refreshTokens',
			'COUNT',
			100
		);
		cursor = nextCursor;

		for (const key of keys) {
			const tokens = await redisClient.smembers(key);

			for (const tokenId of tokens) {
				const exists = await redisClient.exists(`refreshToken:${tokenId}`);

				if (!exists) {
					console.log(`Cleaning stale token ${tokenId} from ${key}`);
					await redisClient.srem(key, tokenId);
				}
			}
		}
	} while (cursor !== '0');

	redisClient.disconnect();
	console.log('Cleanup job complete');
});
