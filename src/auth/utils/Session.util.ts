import Redis from '@/config/redis';
import { UUID } from 'node:crypto';

/**
 * Refresh Tokens stored in redis as sessions to easier revoke or keep track of logged in devices.
 * "user:{userid}:refresh:{jti}": {
 *  "userId": "{userid}",
 *  "jti": "{jti}",
 *  "deviceInfo": "Chrome on Windows 11"
 *  "expiresAt": 0,
 * }
 */
export default class Session {
  public static async validateTokenAsync() {
    // Check if the refresh token is valid in the session store
  }

  public static async createTokenAsync() {
    await Redis.set('key')
      .value({
        userId: 'uuid',
        jti: 'jti',
        deviceInfo: 'Firefox on Windows 11',
      })
      .expires(3600);

    const val = await Redis.get<{
      userId: UUID;
      jti: string;
      deviceInfo: string;
    }>('key');
  }
}
