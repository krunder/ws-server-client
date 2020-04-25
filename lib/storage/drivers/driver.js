class Driver {
  /**
   * Initialise the driver instance.
   *
   * @param {Object} config
   */
  constructor(config) {
    this.config = config;
    this.init();
  };

  /**
   * Initialise any necessary dependencies etc.
   */
  init() {
    throw new Error('The init() method must be implemented on storage drivers.');
  };

  /**
   * Set value in storage system.
   *
   * @param {String} key
   * @param value
   */
  set(key, value) {
    throw new Error('The set() method must be implemented on storage drivers.');
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
    return this.config.storage.prefix + key;
  };
};

module.exports = Driver;
