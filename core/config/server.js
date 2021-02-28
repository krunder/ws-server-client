const environment = process.env.APP_ENV || 'local';

const defaultConfig = {
  app: {
    environment,
    port: process.env.APP_PORT || 21000,
    key: process.env.APP_KEY || 'changeme',
  },

  api: {
    url: process.env.API_URL || '',
  },

  auth: {
    driver: process.env.AUTH_DRIVER,

    endpoints: {
      user: {
        url: process.env.AUTH_URL || '',
        property: 'data',
      },
    },
  },

  cors: {
    headers: process.env.CORS_HEADERS || '*',
    origin: process.env.CORS_ORIGIN || '*',
    methods: process.env.CORS_METHODS || '*',
    credentials: process.env.CORS_CREDENTIALS || true,
  },

  storage: {
    driver: process.env.STORAGE_DRIVER || 'redis',
    prefix: `${environment}_`,
  },

  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || null,
    path: process.env.REDIS_UNIX_PATH || null,
  },
};

module.exports = defaultConfig;
