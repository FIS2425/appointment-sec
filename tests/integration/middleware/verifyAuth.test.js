import { describe, beforeAll, afterAll, it, expect } from 'vitest';
import { request } from '../../setup/setup';
import * as db from '../../setup/database';
import jwt from 'jsonwebtoken';
import { sampleUser, sampleUser2 } from '../utils/testData.js';

beforeAll(async () => {
  await db.clearDatabase();
});

afterAll(async () => {
  await db.clearDatabase();
});

describe('VERIFY AUTHORIZATION Middleware', () => {
  let token1;
  let token2;

  beforeAll(async () => {
    token1 = jwt.sign(
      { userId: sampleUser2._id, roles: sampleUser2.roles },
      process.env.VITE_JWT_SECRET
    );
    token2 = jwt.sign(
      { userId: sampleUser._id, roles: sampleUser.roles },
      process.env.VITE_JWT_SECRET
    );
  });

  it('should validate the token successfully', async () => {
    const res = await request.get('/appointments').set('Cookie', `token=${token2}`);
    expect(res.status).toBe(200);
  });

  it('should return 401 with no token provided', async () => {
    const res = await request.get('/appointments').set('Cookie', '');
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Access denied: No token provided');
  });

  it('should return 401 with invalid token (badly signed)', async () => {
    const invalidToken = 'invalid.token.value';

    const res = await request
      .get('/appointments')
      .set('Cookie', `token=${invalidToken}`);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Invalid token');
  });

  it('should return 401 with insufficient permissions', async () => {
    const res = await request
      .get('/appointments')
      .set('Cookie', `token=${token1}`);

    expect(res.status).toBe(403);
    expect(res.body.error).toBe('Access denied: Insufficient permissions');
  });

});