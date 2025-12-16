import { db } from '@/config/db';
import { permissionTable } from '@/config/db/schema/permission.schema';
import { eq } from 'drizzle-orm';
import type { UUID } from 'node:crypto';
import type { Permission as PermissionType } from '@/admin/interfaces/permission.interface';
import HttpStatus from '@/types/HttpStatus.enum';
import AppError from '@/types/AppError';

export default class Permission {
  private _serviceId: UUID;
  private _permissionId?: UUID;

  constructor(serviceId: UUID, permissionId?: UUID) {
    this._serviceId = serviceId;
    this._permissionId = permissionId;
  }

  public async getAll(): Promise<PermissionType[]> {
    const results = await db.select().from(permissionTable);

    return results;
  }

  public async get(): Promise<PermissionType> {
    if (!this._permissionId)
      throw new AppError(
        'Please specify a permission id',
        HttpStatus.BAD_REQUEST
      );

    const result = (
      await db
        .select()
        .from(permissionTable)
        .where(eq(permissionTable.id, this._permissionId))
    )[0];

    return result;
  }

  public async create(
    data: Omit<typeof permissionTable.$inferInsert, 'id' | 'serviceId'>
  ): Promise<PermissionType> {
    const result = (
      await db
        .insert(permissionTable)
        .values({ ...data, serviceId: this._serviceId })
        .returning()
    )[0];

    return result;
  }

  public async update(
    data: Omit<typeof permissionTable.$inferInsert, 'id' | 'serviceId'>
  ): Promise<PermissionType> {
    if (!this._permissionId)
      throw new AppError(
        'Please specify a permission id',
        HttpStatus.BAD_REQUEST
      );

    const result = (
      await db
        .update(permissionTable)
        .set(data)
        .where(eq(permissionTable.id, this._permissionId))
        .returning()
    )[0];

    return result;
  }

  public async delete(): Promise<PermissionType> {
    if (!this._permissionId)
      throw new AppError(
        'Please specify a permission id',
        HttpStatus.BAD_REQUEST
      );

    const result = (
      await db
        .delete(permissionTable)
        .where(eq(permissionTable.id, this._permissionId))
        .returning()
    )[0];

    return result;
  }
}
