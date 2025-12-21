import { db } from '@/config/db';
import { roleTable } from '@/config/db/schema/role.schema';
import { eq, getTableColumns } from 'drizzle-orm';
import type { UUID } from 'node:crypto';
import type { Role as RoleType } from '@/admin/interfaces/Role.interface';
import HttpStatus from '@/types/HttpStatus.enum';
import AppError from '@/types/AppError';
import { rolePermissionTable } from '@/config/db/schema/rolePermission.schema';
import { permissionTable } from '@/config/db/schema/permission.schema';

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

		if (!result) {
			throw new AppError(
				'A role with that id does not exist',
				HttpStatus.NOT_FOUND
			);
		}

		return result;
	}

	public async create({
		name,
		assignToNewUser,
		permissions,
	}: {
		name: string;
		assignToNewUser: boolean;
		permissions: UUID[];
	}): Promise<RoleType> {
		let result: RoleType;
		await db.transaction(async (tx) => {
			result = (
				await tx
					.insert(roleTable)
					.values({ name, assignToNewUser, serviceId: this._serviceId })
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
