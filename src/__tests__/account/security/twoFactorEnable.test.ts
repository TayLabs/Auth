import app from '@/app';
import HttpStatus from '@/types/HttpStatus.enum';
import { describe, expect, it } from '@jest/globals';
import request from 'supertest';

describe('Enable Two Factor route', () => {
  it('should turn on 2 factor', async () => {
    const response = await request(app).patch(
      '/api/v1/accout/two-factor/' + 'off'
    );

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toHaveProperty('success', true);
  });
});
