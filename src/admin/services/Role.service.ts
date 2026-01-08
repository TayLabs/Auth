import { db } from '@/config/db';
import { roleTable } from '@/config/db/schema/role.schema';
import { DrizzleQueryError, eq, getTableColumns, or } from 'drizzle-orm';
import type { UUID } from 'node:crypto';
import type { Role as RoleType } from '@/admin/interfaces/role.interface';
import HttpStatus from '@/types/HttpStatus.enum';
import AppError from '@/types/AppError';
import { rolePermissionTable } from '@/config/db/schema/rolePermission.schema';
import { permissionTable } from '@/config/db/schema/permission.schema';
import { DatabaseError } from 'pg';

export default class Role {
  private _roleId?: UUID;

  constructor(roleId?: UUID) {
    this._roleId = roleId;
  }

  public async getAll(): Promise<RoleType[]> {
    const roles = await db.select().from(roleTable);

    if (roles.length < 1) return [];

    const permissions = await db
      .select({
        ...getTableColumns(permissionTable),
        roleId: rolePermissionTable.roleId,
      })
      .from(permissionTable)
      .innerJoin(
        rolePermissionTable,
        eq(rolePermissionTable.permissionId, permissionTable.id)
      )
      .where(
        or(...roles.map((role) => eq(rolePermissionTable.roleId, role.id)))
      );

    return roles.map((role) => ({
      ...role,
      permissions: permissions.filter(
        (permission) => permission.roleId === role.id
      ),
    }));
  }

  public async get(): Promise<RoleType> {
    if (!this._roleId)
      throw new AppError('Please specify a role id', HttpStatus.BAD_REQUEST);

    const result: RoleType = (
      await db.select().from(roleTable).where(eq(roleTable.id, this._roleId))
    )[0] as any;

    if (!result) {
      throw new AppError(
        'A role with that id does not exist',
        HttpStatus.NOT_FOUND
      );
    }

    result.permissions = await db
      .select(getTableColumns(permissionTable))
      .from(permissionTable)
      .innerJoin(
        rolePermissionTable,
        eq(rolePermissionTable.permissionId, permissionTable.id)
      )
      .where(eq(rolePermissionTable.roleId, result.id));

    return result;
  }

  public async create({
    name,
    assignToNewUser,
    permissions,
  }: {
    name: string;
    assignToNewUser?: boolean;
    permissions: UUID[];
  }): Promise<RoleType> {
    try {
      let result: RoleType;
      await db.transaction(async (tx) => {
        result = (
          await tx
            .insert(roleTable)
            // isExternal is always true, this is purely to prevent modification of seeded roles as on restart they would be reset anyways
            .values({ name, assignToNewUser })
            .returning()
        )[0] as any;

        if (permissions.length > 0) {
          await tx.insert(rolePermissionTable).values(
            permissions.map((id) => ({
              permissionId: id,
              roleId: result.id,
            }))
          );
        }

        // Populate all permissions for role
        result.permissions = await tx
          .select(getTableColumns(permissionTable))
          .from(permissionTable)
          .innerJoin(
            rolePermissionTable,
            eq(rolePermissionTable.roleId, result.id)
          );
      });

      return result!;
    } catch (err) {
      if (
        err instanceof DrizzleQueryError &&
        err.cause instanceof DatabaseError
      ) {
        switch (err.cause.code) {
          case '23505': // unique_violation
            throw new Error('A role with that name already exist');
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

  public async update({
    name,
    assignToNewUser,
    permissions,
  }: {
    name?: string;
    assignToNewUser?: boolean;
    permissions?: UUID[];
  }): Promise<RoleType> {
    try {
      let result: RoleType;
      await db.transaction(async (tx) => {
        const selected = (
          await db
            .select({ isExternal: roleTable.isExternal })
            .from(roleTable)
            .where(eq(roleTable.id, this._roleId!))
        )[0];

        if (!selected)
          throw new AppError(
            'A role with this Id could not be found',
            HttpStatus.NOT_FOUND
          );
        else if (!selected.isExternal)
          throw new AppError(
            'Cannot edit an internal role',
            HttpStatus.BAD_REQUEST
          );

        result = (
          await tx
            .update(roleTable)
            .set({ name, assignToNewUser })
            .where(eq(roleTable.id, this._roleId!))
            .returning()
        )[0] as any;

        if (permissions && permissions.length > 0) {
          await tx
            .insert(rolePermissionTable)
            .values(
              permissions.map((permissionId) => ({
                permissionId,
                roleId: this._roleId!,
              }))
            )
            .onConflictDoNothing();
        }

        const allPermissions = await tx
          .select()
          .from(rolePermissionTable)
          .where(eq(rolePermissionTable.roleId, this._roleId!));

        const oldPermissions = allPermissions.filter(
          (existing) =>
            !permissions?.find(
              (permissionId) => permissionId === existing.permissionId
            )
        );

        if (oldPermissions.length > 0) {
          await tx
            .delete(rolePermissionTable)
            .where(
              or(
                ...oldPermissions.map((permission) =>
                  eq(rolePermissionTable.permissionId, permission.permissionId)
                )
              )
            );
        }

        result.permissions = await tx
          .select(getTableColumns(permissionTable))
          .from(permissionTable)
          .innerJoin(
            rolePermissionTable,
            eq(rolePermissionTable.permissionId, permissionTable.id)
          )
          .where(eq(rolePermissionTable.roleId, this._roleId!));
      });

      return result!;
    } catch (err) {
      if (
        err instanceof DrizzleQueryError &&
        err.cause instanceof DatabaseError
      ) {
        switch (err.cause.code) {
          // case '23505': // unique_violation
          // 	throw new Error('A role with that name already exist');
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

  public async delete(): Promise<{ id: UUID }> {
    if (!this._roleId)
      throw new AppError('Please specify a role id', HttpStatus.BAD_REQUEST);

    const result = (
      await db
        .delete(roleTable)
        .where(eq(roleTable.id, this._roleId))
        .returning()
    )[0];

    return { id: result.id };
  }
}
