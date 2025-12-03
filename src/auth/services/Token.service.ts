import AppError from '@/types/AppError';
import { randomBytes, type UUID } from 'node:crypto';
import HttpStatus from '@/types/HttpStatus.enum';
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import env from '@/types/env';
import parseTTL from '../utils/parseTTL.utils';
import type { Request, Response } from 'express';
import { db } from '@/config/db';
import { deviceTable } from '@/config/db/schema/device.schema';
import { parseDeviceIP, parseDeviceType } from '../utils/device.utils';
import redisClient from '@/config/redis/client';
import { DrizzleQueryError, eq } from 'drizzle-orm';
import { DeviceType, IPAddress } from '@/types/DeviceType';
import { DatabaseError } from 'pg';
import {
  accessTokenCookie,
  deviceCookie,
  selectedSessionCookie,
  sessionCookie,
} from '../constants/cookies';
import type { User } from '@/interfaces/user.interface';

export type SessionBody = {
  rid: string;
  pendingTwoFactor: boolean;
  pendingPasswordReset: boolean;
  pendingEmailVerification: boolean;
  device: {
    id: UUID;
    deviceType: DeviceType;
    ipAddress: IPAddress;
  };
  lastUsedAt: number;
};

export type RefreshTokenPayload = {
  rid: string;
  userId: UUID;
  deviceId: UUID;
  issuedAt: number;
};

export type AccessTokenPayload = {
  sid: string;
  userId: UUID;
  issuer: string;
  audience: string;
  pending: PendingActionType;
  scopes: string[];
  issuedAt: number;
};

export type PendingActionType =
  | '2fa'
  | 'passwordReset'
  | 'emailVerification'
  | null;

export default class Token {
  private _req;
  private _res;

  constructor(req: Request, res: Response) {
    this._req = req;
    this._res = res;
  }

  /**
   * @description Function to create a token from a payload, returns token in a string format
   * @param userId UUID
   * @param deviceId UUID Stored in cookie so each device has a unique identifier
   * @returns string
   */
  public async create(user: User): Promise<{
    accessToken: string;
  }> {
    try {
      let sessionId = randomBytes(16).toString('hex'); // len: 32
      const refreshTokenId = randomBytes(8).toString('hex'); // len: 16
      const deviceId = this._req.cookies[deviceCookie.name] as UUID | undefined;

      // Add log for device's token session
      const deviceRecord = (
        await db
          .insert(deviceTable)
          .values({
            userId: user.id,
            sessionId,
            deviceId, // If no device id is specified (undefined) then it will be auto generated
            device: {
              ipAddress: parseDeviceIP(this._req),
              deviceType: parseDeviceType(this._req.useragent),
              browser: this._req.useragent?.browser,
              version: this._req.useragent?.version.toString(),
              os: this._req.useragent?.os,
              platform: this._req.useragent?.platform,
              source: this._req.useragent?.source,
            },
          })
          .onConflictDoUpdate({
            // If there's already a record for that device and user, update the record
            target: [deviceTable.userId, deviceTable.deviceId],
            set: {
              sessionId,
              device: {
                // Shouldn't change, just incase there's an os update of any sort
                ipAddress: parseDeviceIP(this._req),
                deviceType: parseDeviceType(this._req.useragent),
                browser: this._req.useragent?.browser,
                version: this._req.useragent?.version.toString(),
                os: this._req.useragent?.os,
                platform: this._req.useragent?.platform,
                source: this._req.useragent?.source,
              },
              lastUsedAt: new Date(),
            },
          })
          .returning()
      )?.[0];

      if (!deviceId) {
        this._res.cookie(
          deviceCookie.name,
          deviceRecord.deviceId,
          deviceCookie.options
        );
      }

      // Register refresh token in redis whitelist
      const sessionKey = `session:${sessionId}`;
      const sessionBody = {
        rid: refreshTokenId,
        pendingTwoFactor: user.twoFactorEnabled,
        pendingPasswordReset: user.forcePasswordChange,
        pendingEmailVerification: !user.emailVerified,
        device: {
          // Log for validation and to prevent token theft if possible
          id: deviceRecord.deviceId,
          deviceType: deviceRecord.device.deviceType,
          ipAddress: deviceRecord.device.ipAddress,
        },
        lastUsedAt: Date.now(),
      } satisfies SessionBody;
      await redisClient.hset(
        sessionKey,
        Object.fromEntries(
          Object.entries(sessionBody).map(([key, value]) => [
            key,
            JSON.stringify(value),
          ])
        )
      );
      await redisClient.expire(
        sessionKey,
        parseTTL(env.REFRESH_TOKEN_TTL).seconds
      );

      // Create Refresh JWT
      const refreshToken = jwt.sign(
        {
          rid: refreshTokenId,
          userId: user.id,
          deviceId: deviceRecord.deviceId,
          issuedAt: Date.now(),
        } satisfies RefreshTokenPayload,
        env.REFRESH_TOKEN_SECRET,
        {
          expiresIn: parseTTL(env.REFRESH_TOKEN_TTL).seconds,
        }
      );
      this._res.cookie(
        selectedSessionCookie.name,
        sessionId,
        selectedSessionCookie.options
      );
      this._res.cookie(
        sessionCookie.name(sessionId),
        refreshToken,
        sessionCookie.options
      );

      // Create Access JWT
      let pending: PendingActionType = null;
      if (sessionBody.pendingTwoFactor) pending = '2fa';
      else if (sessionBody.pendingPasswordReset) pending = 'passwordReset';
      else if (sessionBody.pendingEmailVerification)
        pending = 'emailVerification';

      const accessToken = jwt.sign(
        {
          sid: sessionId,
          userId: user.id,
          issuer: 'This apis hostname',
          audience: 'taylab-services',
          pending,
          scopes: ['user.read'], // TODO: Add permissions that the user has (based on db once implemented)
          issuedAt: Date.now(),
        } satisfies AccessTokenPayload,
        env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: parseTTL(env.ACCESS_TOKEN_TTL).seconds,
        }
      );
      this._res.cookie(
        accessTokenCookie.name,
        accessToken,
        accessTokenCookie.options
      );

      return {
        accessToken,
      };
    } catch (err) {
      if (
        err instanceof DrizzleQueryError &&
        err.cause instanceof DatabaseError
      ) {
        switch (err.cause.code) {
          // case '23505': // unique_violation
          // 	throw new Error('Unique violation', ); // Should occur as .onConflictUpdate exist
          case '42P01': // undefined_table
            throw new AppError(
              'Database table not found',
              HttpStatus.INTERNAL_SERVER_ERROR
            );
          default:
            throw err;
        }
      } else {
        throw err;
      }
    }
  }

  /**
   * @description Refresh both the access and refresh tokens
   */
  public async refresh(options?: {
    resolve?: NonNullable<PendingActionType>;
  }): Promise<{
    accessToken: string;
  }> {
    const sessionId = this._req.cookies[selectedSessionCookie.name] as string;
    const sessionKey = `session:${sessionId}`;

    // Validate the old refresh token
    const token = this._req.cookies[sessionCookie.name(sessionId)] as string;
    const deviceId = this._req.cookies[deviceCookie.name] as UUID;
    const decodedToken = jwt.verify(
      token,
      env.REFRESH_TOKEN_SECRET
    ) as RefreshTokenPayload;

    // Fetch session record from Redis
    const sessionRecord = await redisClient.hgetall(sessionKey);

    if (sessionRecord === null) {
      throw new AppError(
        'Invalid token, please login again',
        HttpStatus.UNAUTHORIZED
      );
    }

    const session = Object.fromEntries(
      Object.entries(sessionRecord).map(([key, value]) => [
        key,
        JSON.parse(value),
      ])
    ) as SessionBody;

    // If refresh token id is whitelisted with matching device IDs, and if the DeviceType and IP Address both are the same, token is valid
    // If either IP or DeviceType change due to a network or device update it will be reflected in the session.
    // * This is done for further security and may be removed in future if it causes any UX problems
    if (
      session.rid !== decodedToken.rid ||
      session.device.id !== deviceId ||
      (session.device.deviceType !== parseDeviceType(this._req.useragent) &&
        session.device.ipAddress !== parseDeviceIP(this._req))
    ) {
      throw new AppError(
        'Invalid token, please login again',
        HttpStatus.UNAUTHORIZED
      );
    }

    // Create new refresh token
    const refreshTokenId = randomBytes(8).toString('hex'); // len: 16

    // Update whitelist to reflect new refresh token id
    const sessionBody = {
      rid: refreshTokenId,
      pendingTwoFactor:
        options?.resolve === '2fa' ? false : session.pendingTwoFactor,
      pendingPasswordReset:
        options?.resolve === 'passwordReset'
          ? false
          : session.pendingPasswordReset,
      pendingEmailVerification:
        options?.resolve === 'emailVerification'
          ? false
          : session.pendingEmailVerification,
      device: {
        id: session.device.id,
        deviceType: parseDeviceType(this._req.useragent),
        ipAddress: parseDeviceIP(this._req),
      },
      lastUsedAt: Date.now(),
    } satisfies SessionBody;
    await redisClient.hset(
      sessionKey,
      Object.fromEntries(
        Object.entries(sessionBody).map(([key, value]) => [
          key,
          JSON.stringify(value),
        ])
      )
    );
    await redisClient.expire(
      sessionKey,
      parseTTL(env.REFRESH_TOKEN_TTL).seconds
    );

    const newRefreshToken = jwt.sign(
      {
        rid: refreshTokenId,
        userId: decodedToken.userId,
        deviceId: deviceId,
        issuedAt: Date.now(),
      } as RefreshTokenPayload,
      env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: parseTTL(env.REFRESH_TOKEN_TTL).seconds,
      }
    );
    this._res.cookie(
      sessionCookie.name(sessionId),
      newRefreshToken,
      sessionCookie.options
    );

    let pending: PendingActionType = null;
    // Check new session body for pending
    if (sessionBody.pendingTwoFactor) pending = '2fa';
    else if (sessionBody.pendingPasswordReset) pending = 'passwordReset';
    else if (sessionBody.pendingEmailVerification)
      pending = 'emailVerification';

    const newAccessToken = jwt.sign(
      {
        sid: sessionId,
        userId: decodedToken.userId,
        issuer: 'This apis hostname',
        audience: 'taylab-services',
        pending,
        scopes: ['user.read'], // TODO: Add permissions that the user has (based on db once implemented)
        issuedAt: Date.now(),
      } satisfies AccessTokenPayload,
      env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: parseTTL(env.ACCESS_TOKEN_TTL).seconds,
      }
    );
    this._res.cookie(
      accessTokenCookie.name,
      newAccessToken,
      accessTokenCookie.options
    );

    return {
      accessToken: newAccessToken,
    };
  }

  /**
   * @description Throws an error if the token is invalid
   * @param token string
   * @returns AccessTokenPayload
   */
  public verify(accessToken: string): AccessTokenPayload {
    try {
      const decodedToken = jwt.verify(
        accessToken,
        env.ACCESS_TOKEN_SECRET
      ) as AccessTokenPayload;

      return decodedToken;
    } catch (err) {
      if (err instanceof JsonWebTokenError) {
        throw new AppError(
          'Missing or Invalid Access Token',
          HttpStatus.UNAUTHORIZED
        );
      } else if (err instanceof TokenExpiredError) {
        throw new AppError('Token expired', HttpStatus.UNAUTHORIZED);
      } else {
        throw new AppError(
          'An error occured, please try again later',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }
  }

  /**
   * @description Invalidates the refresh token by removing it's entry from the whitelist
   */
  public async invalidate(deviceId: UUID) {
    // Update device table with status 'revoked'
    const deviceRecord = (
      await db
        .update(deviceTable)
        .set({
          status: 'revoked',
        })
        .where(eq(deviceTable.deviceId, deviceId))
        .returning({ sessionId: deviceTable.sessionId })
    )?.[0];

    // Delete token from session whitelist
    await redisClient.del(deviceRecord.sessionId);
  }

  /**
   * @description Invalidates all refresh tokens for a user
   */
  public async invalidateAll() {
    const userId = this._req.user.id;

    const deviceRecords = await db
      .update(deviceTable)
      .set({
        status: 'revoked',
      })
      .where(eq(deviceTable.userId, userId))
      .returning({
        sessionId: deviceTable.sessionId,
      });

    for (const record of deviceRecords) {
      await redisClient.del(record.sessionId);
    }
  }
}
