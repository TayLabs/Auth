import app from '@/app';
import { users } from '@/config/db/seed/test.data';
import HttpStatus from '@/types/HttpStatus.enum';
import { describe, expect } from '@jest/globals';
import request from 'supertest';

describe('Login route', () => {
	test('Return successful with proper credentials', async () => {
		const response = await request(app).post('/api/v1/auth/login').send({
			email: users[0].email,
			password: users[0].passwordHash,
		});

		expect(response.status).toBe(HttpStatus.OK);
		expect(response.body).toHaveProperty('success', true);
		expect(response.body).toHaveProperty('data.user');
		expect(response.body).toHaveProperty('data.accessToken');
	});
});
