import Redis from 'ioredis'

const redisClient = new Redis({
  host: process.env.DRAGONFLY_HOST,
  port: process.env.DRAGONFLY_PORT,
});

export default redisClient;
