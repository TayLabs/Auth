import redisClient from '@/config/redis/client';

export interface RefreshTokenData {
	userId: string;
	deviceId: string;
	issuedAt: number;
}

export class RefreshTokenStore {
	private client = redisClient;
	private ttlSeconds: number;

	constructor(ttlSeconds = 60 * 60 * 24 * 7) {
		// default: 7 days
		this.ttlSeconds = ttlSeconds;
	}

	private tokenKey(tokenId: string) {
		return `refresh:${tokenId}`;
	}

	private userSetKey(userId: string) {
		return `user:${userId}:refreshTokens`;
	}

	private deviceSetKey(deviceId: string) {
		return `device:${deviceId}:refreshTokens`;
	}

	/**
	 * Store a refresh token
	 */
	async addToken(tokenId: string, data: RefreshTokenData) {
		const tokenKey = this.tokenKey(tokenId);

		await this.client.hset(tokenKey, {
			userId: data.userId,
			deviceId: data.deviceId,
			issuedAt: data.issuedAt.toString(),
		});

		await this.client.expire(tokenKey, this.ttlSeconds);

		await this.client.sadd(this.userSetKey(data.userId), tokenId);
		await this.client.sadd(this.deviceSetKey(data.deviceId), tokenId);
	}

	/**
	 * Delete a single refresh token
	 */
	async deleteToken(tokenId: string) {
		const tokenKey = this.tokenKey(tokenId);
		const tokenData = await this.client.hgetall(tokenKey);

		if (Object.keys(tokenData).length === 0) {
			return; // already deleted or expired
		}

		const { userId, deviceId } = tokenData;
		await this.client.srem(this.userSetKey(userId), tokenId);
		await this.client.srem(this.deviceSetKey(deviceId), tokenId);

		await this.client.del(tokenKey);
	}

	/**
	 * Delete all tokens for a user (global logout)
	 */
	async deleteAllTokensForUser(userId: string) {
		const userSet = this.userSetKey(userId);
		const tokenIds = await this.client.smembers(userSet);

		if (tokenIds.length === 0) return;

		const multi = this.client.multi();

		for (const tokenId of tokenIds) {
			const tokenKey = this.tokenKey(tokenId);
			multi.del(tokenKey);
			multi.srem(userSet, tokenId);
		}

		multi.del(userSet);
		await multi.exec();
	}

	/**
	 * Logout from a specific device
	 */
	async deleteTokensForDevice(deviceId: string) {
		const deviceSet = this.deviceSetKey(deviceId);
		const tokenIds = await this.client.smembers(deviceSet);

		if (tokenIds.length === 0) return;

		const multi = this.client.multi();

		for (const tokenId of tokenIds) {
			const tokenKey = this.tokenKey(tokenId);

			// First lookup userId OUTSIDE the multi block
			const tokenData = await this.client.hgetall(tokenKey);
			const userId = tokenData.userId;

			// Queue deletions
			multi.del(tokenKey);
			multi.srem(deviceSet, tokenId);

			if (userId) {
				multi.srem(this.userSetKey(userId), tokenId);
			}
		}

		// Finally clear the device set
		multi.del(deviceSet);

		await multi.exec();
	}

	/**
	 * Validate token & fetch metadata
	 */
	async getToken(tokenId: string): Promise<RefreshTokenData | null> {
		const data = await this.client.hgetall(this.tokenKey(tokenId));
		if (!data.userId) return null;

		return {
			userId: data.userId,
			deviceId: data.deviceId,
			issuedAt: Number(data.issuedAt),
		};
	}
}
