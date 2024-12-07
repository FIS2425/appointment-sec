import { beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';

import * as db from './database';
import configureApp from '../../src/api.js';

const app = configureApp();

let server;
let request;

beforeAll(async () => {
  await db.connect();
  await mockRedis();
  server = app.listen(0);
  request = supertest.agent(server);
});

afterAll(async () => {
  await db.closeDatabase();
  server.close();
});

async function mockRedis() {
  // Mock Redis
  vi.mock('ioredis', () => {
    return import('ioredis-mock'); // Dynamically import 'redis-mock' for mocking
  });
  console.log('Redis mocked');
};


export { request };
