import redis from 'redis';

const redisClient = redis.createClient({
  socket: {
    host: process.env.DRAGONFLY_HOST || 'dragonfly',
    port: process.env.DRAGONFLY_PORT || 6379,
  },
});

export default function () {
  try {
    redisClient.on('connect', () => {
      console.log('Connected to Redis...');
    });

    redisClient.on('error', (err) => {
      console.error('Redis error:', err);
    });

    redisClient.on('end', () => {
      console.log('Redis client disconnected');
    });

    redisClient.on('reconnecting', () => {
      console.log('Attempting to reconnect to Redis...');
    });

    redisClient.connect();
  } catch (error) {
    console.error('Error de conexión con Redis:', error.message);
  }
};
