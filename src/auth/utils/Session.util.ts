import redisClient from '@/config/redis/client';
import env from '@/types/env';
import parseTTL from './parseTTL';

export interface RefreshTokenData {
  userId: string;
  deviceId: string;
  issuedAt: number;
}

export class Session {
  /**
   * Store a refresh token
   */
  public static async addToken(tokenId: string, data: RefreshTokenData) {
    const tokenKey = `refresh${tokenId}`;

    await redisClient.hset(tokenKey, {
      userId: data.userId,
      deviceId: data.deviceId,
      issuedAt: data.issuedAt.toString(),
    });
    await redisClient.expire(tokenKey, parseTTL(env.REFRESH_TOKEN_TTL).seconds);

    await redisClient.sadd(`user:${data.userId}:refreshTokens`, tokenId);
    await redisClient.sadd(`device:${data.deviceId}:refreshTokens`, tokenId);
  }

  /**
   * Delete a single refresh token
   */
  public static async deleteToken(tokenId: string) {
    const tokenKey = `refresh${tokenId}`;
    const tokenData = await redisClient.hgetall(tokenKey);

    if (Object.keys(tokenData).length === 0) {
      return; // already deleted or expired
    }

    const { userId, deviceId } = tokenData;
    await redisClient.srem(`user:${userId}:refreshTokens`, tokenId);
    await redisClient.srem(`device:${deviceId}:refreshTokens`, tokenId);

    await redisClient.del(tokenKey);
  }

  /**
   * Delete all tokens for a user (global logout)
   */
  public static async deleteAllTokensForUser(userId: string) {
    const userSet = `user:${userId}:refreshTokens`;
    const tokenIds = await redisClient.smembers(userSet);

    if (tokenIds.length === 0) return;

    const multi = redisClient.multi();

    for (const tokenId of tokenIds) {
      const tokenKey = `refresh${tokenId}`;
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
    const deviceSet = `device:${deviceId}:refreshTokens`;
    const tokenIds = await redisClient.smembers(deviceSet);

    if (tokenIds.length === 0) return;

    const multi = redisClient.multi();

    for (const tokenId of tokenIds) {
      const tokenKey = `refresh${tokenId}`;

      // First lookup userId OUTSIDE the multi block
      const tokenData = await redisClient.hgetall(tokenKey);
      const userId = tokenData.userId;

      // Queue deletions
      multi.del(tokenKey);
      multi.srem(deviceSet, tokenId);

      if (userId) {
        multi.srem(`user:${userId}:refreshTokens`, tokenId);
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
    const data = await redisClient.hgetall(`refresh${tokenId}`);
    if (!data.userId) return null;

    return {
      userId: data.userId,
      deviceId: data.deviceId,
      issuedAt: Number(data.issuedAt),
    };
  }
}
