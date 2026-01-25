import request from 'supertest';
import app from '@/app';
import { closeConnections } from './utils/cleanup';

describe('Health Check (E2E)', () => {
	afterAll(closeConnections);

	it('GET /health - should return 200 with success of true and status of "connected"', async () => {
		const response = await request(app).get('/api/v1/ok');

		expect(response.status).toBe(200); // 200 OK
		expect(response.body).toEqual({
			success: true,
			status: 'connected',
		});
	});
});
