import app from '@/app';
import HttpStatus from '@/types/HttpStatus.enum';
import { describe, expect } from '@jest/globals';
import request from 'supertest';

describe('Enable Two Factor route', () => {
  test('Enable two factor returns successful', async () => {
    const response = await request(app).post('/api/v1/accout/two-factor/on');

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toHaveProperty('success', true);
  });
});
