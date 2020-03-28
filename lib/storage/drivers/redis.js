const Driver = require('./driver');
const redis = require('redis');

class Redis extends Driver {
  init() {
    this.client = redis.createClient(this.config.redis);
  };
};

module.exports = Redis;
