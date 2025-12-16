import { db } from '@/config/db';
import { serviceTable } from '@/config/db/schema/service.schema';
import { eq } from 'drizzle-orm';
import type { UUID } from 'node:crypto';
import type { Service as ServiceType } from '@/admin/interfaces/service.interface';

export default class Service {
  private _serviceId: UUID;

  constructor(serviceId: UUID) {
    this._serviceId = serviceId;
  }

  public static async getAll(): Promise<ServiceType[]> {
    const results = await db.select().from(serviceTable);

    return results;
  }

  public async get(): Promise<ServiceType> {
    const result = (
      await db
        .select()
        .from(serviceTable)
        .where(eq(serviceTable.id, this._serviceId))
    )[0];

    return result;
  }

  public static async create(
    data: Omit<typeof serviceTable.$inferInsert, 'id'>
  ): Promise<ServiceType> {
    const result = (await db.insert(serviceTable).values(data).returning())[0];

    return result;
  }

  public async update(
    data: Omit<typeof serviceTable.$inferInsert, 'id'>
  ): Promise<ServiceType> {
    const result = (
      await db
        .update(serviceTable)
        .set(data)
        .where(eq(serviceTable.id, this._serviceId))
        .returning()
    )[0];

    return result;
  }

  public async delete(): Promise<ServiceType> {
    const result = (
      await db
        .delete(serviceTable)
        .where(eq(serviceTable.id, this._serviceId))
        .returning()
    )[0];

    return result;
  }
}
