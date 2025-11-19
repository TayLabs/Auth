import { type UUID } from 'node:crypto';
import redisClient from './client';

type Task = () => Promise<void | any>;

export default class Redis {
  public static async get<T>(key: string) {
    const value = await redisClient.get(key);

    return value && (JSON.parse(value) as T);
  }

  public static set(userId: UUID) {
    return new RedisInsertQuery(userId);
  }

  public static async delete(key: string) {
    await redisClient.del(key);
  }

  public static async deleteAll(userId: UUID) {
    // const keys = await redisClient.scan(0, 'MATCH', `user:${userId}:refresh:*`);
  }
}

class RedisInsertQuery {
  private userId: string;
  private _tasks: Task[] = [];

  constructor(userId: string) {
    this._userId = userId;
  }

  public value<T>(value: T) {
    // Insert all values into Redis
    this._tasks.push(async () => {
      await redisClient.hset(this._key, JSON.stringify(value));
    });

    return this;
  }

  public expires(seconds: number) {
    this._tasks.push(async () => {
      await redisClient.expire(this._key, seconds);
    });

    return this;
  }

  // Make everything awaitable
  public then<TResult1 = void, TResult2 = never>(
    onfulfilled?:
      | ((value: void) => TResult1 | PromiseLike<TResult1>)
      | undefined
      | null,
    onrejected?:
      | ((reason: any) => TResult2 | PromiseLike<TResult2>)
      | undefined
      | null
  ): Promise<TResult1 | TResult2> {
    return this.execute().then(onfulfilled, onrejected);
  }

  private async execute(): Promise<void> {
    for (const task of this._tasks) {
      await task();
    }
  }
}
