import app from '@/app';
import HttpStatus from '@/types/HttpStatus.enum';
import { describe, expect } from '@jest/globals';
import request from 'supertest';

describe('Login route', () => {
	test('Unknown routes return 404', async () => {
		const response = await request(app).get('/unknown-route');

		expect(response.status).toBe(HttpStatus.NOT_FOUND);
		expect(response.body).toHaveProperty('message', 'Resource not found');
	});
});
