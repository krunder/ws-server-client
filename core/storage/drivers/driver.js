const Config = require('../../config/config');

class Driver {
  /**
   * Initialise new instance.
   *
   * @param {Config} config
   */
  constructor(config) {
    this.config = config;
    this.init();
  };

  /**
   * Initialise the driver.
   */
  init() {
    throw new Error('The init() method must be implemented on storage drivers.');
  };

  /**
   * Set value in storage system.
   *
   * @param {String} key
   * @param value
   * @param {Number} seconds
   */
  set(key, value, seconds) {
    throw new Error('The set() method must be implemented on storage drivers.');
  };

  /**
   * Forget key in storage system.
   *
   * @param {String} key
   */
  forget(key) {
    throw new Error('The forget() method must be implemented on storage drivers.');
  };

  /**
   * Get value from storage system.
   *
   * @param {String} key
   */
  get(key) {
    throw new Error('The get() method must be implemented on storage drivers.');
  };

  /**
   * Get key with storage value prefix.
   *
   * @param key
   * @returns {*}
   */
  getKeyPrefixed(key) {
    return this.config.get('storage.prefix') + key;
  };
};

module.exports = Driver;
