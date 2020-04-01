const Driver = require('./driver');
const redis = require('redis');
const { promisify } = require('util');

class Redis extends Driver {
  init() {
    this.client = redis.createClient(this.config.redis);
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
