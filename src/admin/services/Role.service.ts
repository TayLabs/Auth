import { db } from '@/config/db';
import { roleTable } from '@/config/db/schema/role.schema';
import { eq } from 'drizzle-orm';
import type { UUID } from 'node:crypto';
import type { Role as RoleType } from '@/admin/interfaces/role.interface';
import HttpStatus from '@/types/HttpStatus.enum';
import AppError from '@/types/AppError';

export default class Role {
  private _serviceId: UUID;
  private _roleId?: UUID;

  constructor(serviceId: UUID, roleId?: UUID) {
    this._serviceId = serviceId;
    this._roleId = roleId;
  }

  public async getAll(): Promise<RoleType[]> {
    const results = await db
      .select()
      .from(roleTable)
      .where(eq(roleTable.serviceId, this._serviceId));

    return results;
  }

  public async get(): Promise<RoleType> {
    if (!this._roleId)
      throw new AppError('Please specify a role id', HttpStatus.BAD_REQUEST);

    const result = (
      await db.select().from(roleTable).where(eq(roleTable.id, this._roleId))
    )[0];

    return result;
  }

  public async create(
    data: Omit<typeof roleTable.$inferInsert, 'id' | 'serviceId'>
  ): Promise<RoleType> {
    const result = (
      await db
        .insert(roleTable)
        .values({ ...data, serviceId: this._serviceId })
        .returning()
    )[0];

    return result;
  }

  public async update(
    data: Omit<typeof roleTable.$inferInsert, 'id'>
  ): Promise<RoleType> {
    if (!this._roleId)
      throw new AppError('Please specify a role id', HttpStatus.BAD_REQUEST);

    const result = (
      await db
        .update(roleTable)
        .set(data)
        .where(eq(roleTable.id, this._roleId))
        .returning()
    )[0];

    return result;
  }

  public async delete(): Promise<RoleType> {
    if (!this._roleId)
      throw new AppError('Please specify a role id', HttpStatus.BAD_REQUEST);

    const result = (
      await db
        .delete(roleTable)
        .where(eq(roleTable.id, this._roleId))
        .returning()
    )[0];

    return result;
  }
}
