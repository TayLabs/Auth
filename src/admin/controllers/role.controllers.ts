import { controller } from '@/middleware/controller.middleware';
import { type AddRoleReqBody, type AddRoleResBody } from '../dto/roles/add.dto';

export const add = controller<AddRoleReqBody, AddRoleResBody>(
	async (req, res, _next) => {
		console.log(req.body);
		res.send({
			success: true,
			data: {
				role: {
					id: '5353a041-01b1-4b77-9486-14d953929352',
					name: 'role.name',
				},
			},
		});
	}
);
