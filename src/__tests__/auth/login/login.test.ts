import app from '@/app';
import HttpStatus from '@/types/HttpStatus.enum';
import { describe, expect } from '@jest/globals';
import request from 'supertest';

describe('Login route', () => {
  test('Login route with proper credentials returns successful', async () => {
    const response = await request(app).post('/api/v1/auth/login').send({
      email: '',
      password: '',
    });

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('data.user');
    expect(response.body).toHaveProperty('data.accessToken');
  });
});
