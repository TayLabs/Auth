import redisClient from '@/config/redis/client';

export interface RefreshTokenData {
  userId: string;
  deviceId: string;
  issuedAt: number;
}

const tokenKey = (tokenId: string) => `refresh:${tokenId}`;
const userSetKey = (userId: string) => `user:${userId}:refreshTokens`;
const deviceSetKey = (deviceId: string) => `device:${deviceId}:refreshTokens`;

export class Session {
  /**
   * Store a refresh token
   */
  public static async addToken(tokenId: string, data: RefreshTokenData) {
    const tokenKey = tokenKey(tokenId);

    await redisClient.hset(tokenKey, {
      userId: data.userId,
      deviceId: data.deviceId,
      issuedAt: data.issuedAt.toString(),
    });

    await redisClient.expire(tokenKey, ttlSeconds);

    await redisClient.sadd(userSetKey(data.userId), tokenId);
    await redisClient.sadd(deviceSetKey(data.deviceId), tokenId);
  }

  /**
   * Delete a single refresh token
   */
  public static async deleteToken(tokenId: string) {
    const tokenKey = tokenKey(tokenId);
    const tokenData = await redisClient.hgetall(tokenKey);

    if (Object.keys(tokenData).length === 0) {
      return; // already deleted or expired
    }

    const { userId, deviceId } = tokenData;
    await redisClient.srem(userSetKey(userId), tokenId);
    await redisClient.srem(deviceSetKey(deviceId), tokenId);

    await redisClient.del(tokenKey);
  }

  /**
   * Delete all tokens for a user (global logout)
   */
  public static async deleteAllTokensForUser(userId: string) {
    const userSet = userSetKey(userId);
    const tokenIds = await redisClient.smembers(userSet);

    if (tokenIds.length === 0) return;

    const multi = redisClient.multi();

    for (const tokenId of tokenIds) {
      const tokenKey = tokenKey(tokenId);
      multi.del(tokenKey);
      multi.srem(userSet, tokenId);
    }

    multi.del(userSet);
    await multi.exec();
  }

  /**
   * Logout from a specific device
   */
  public static async deleteTokensForDevice(deviceId: string) {
    const deviceSet = deviceSetKey(deviceId);
    const tokenIds = await redisClient.smembers(deviceSet);

    if (tokenIds.length === 0) return;

    const multi = redisClient.multi();

    for (const tokenId of tokenIds) {
      const tokenKey = tokenKey(tokenId);

      // First lookup userId OUTSIDE the multi block
      const tokenData = await redisClient.hgetall(tokenKey);
      const userId = tokenData.userId;

      // Queue deletions
      multi.del(tokenKey);
      multi.srem(deviceSet, tokenId);

      if (userId) {
        multi.srem(userSetKey(userId), tokenId);
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
    const data = await redisClient.hgetall(tokenKey(tokenId));
    if (!data.userId) return null;

    return {
      userId: data.userId,
      deviceId: data.deviceId,
      issuedAt: Number(data.issuedAt),
    };
  }
}
