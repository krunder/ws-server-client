const Driver = require('./driver');
const redis = require('redis');
const { promisify } = require('util');

class Redis extends Driver {
  init() {
    const config = this.config.get('redis');

    if (config.password || config.path) {
      this.client = redis.createClient(config);
    } else {
      this.client = redis.createClient({
        host: config.host,
        port: config.port,
      });
    }
  };

  set(key, value) {
    const async = promisify(this.client.set).bind(this.client);
    return async(this.getKeyPrefixed(key), value);
  };

  get(key) {
    const async = promisify(this.client.get).bind(this.client);
    return async(this.getKeyPrefixed(key));
  };
};

module.exports = Redis;
