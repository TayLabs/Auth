import { controller } from '@/middleware/controller.middleware';
import type {
	AddPermissionReqBody,
	AddPermissionReqParams,
	AddPermissionResBody,
} from '../dto/permissions/add.dto';
import HttpStatus from '@/types/HttpStatus.enum';
import type {
	DeletePermissionReqParams,
	DeletePermissionResBody,
} from '../dto/permissions/delete.dto';
import type {
	UpdatePermissionReqBody,
	UpdatePermissionReqParams,
	UpdatePermissionResBody,
} from '../dto/permissions/update.dto';
import type {
	GetPermissionReqParams,
	GetPermissionResBody,
} from '../dto/permissions/get.dto';
import type {
	GetAllPermissionsReqParams,
	GetAllPermissionsResBody,
} from '../dto/permissions/getAll.dto';
import Permission from '../services/Permission.service';

export const getAll = controller<
	{},
	GetAllPermissionsResBody,
	GetAllPermissionsReqParams
>(async (req, res, _next) => {
	const permissions = await new Permission(req.params.serviceId).getAll();

	res.status(HttpStatus.OK).json({
		success: true,
		data: {
			permissions,
		},
	});
});

export const get = controller<{}, GetPermissionResBody, GetPermissionReqParams>(
	async (req, res, _next) => {
		const permission = await new Permission(
			req.params.serviceId,
			req.params.permissionId
		).get();

		res.status(HttpStatus.OK).json({
			success: true,
			data: {
				permission,
			},
		});
	}
);

export const add = controller<
	AddPermissionReqBody,
	AddPermissionResBody,
	AddPermissionReqParams
>(async (req, res, _next) => {
	const permission = await new Permission(req.params.serviceId).create(
		req.body
	);

	res.status(HttpStatus.CREATED).json({
		success: true,
		data: {
			permission,
		},
	});
});

export const update = controller<
	UpdatePermissionReqBody,
	UpdatePermissionResBody,
	UpdatePermissionReqParams
>(async (req, res, _next) => {
	const permission = await new Permission(req.params.permissionId).update(
		req.body
	);

	res.status(HttpStatus.OK).json({
		success: true,
		data: {
			permission,
		},
	});
});

export const deletePermission = controller<
	{},
	DeletePermissionResBody,
	DeletePermissionReqParams
>(async (req, res, _next) => {
	const permission = await new Permission(req.params.permissionId).delete();

	res.status(HttpStatus.OK).json({
		success: true,
		data: {
			permission,
		},
	});
});
