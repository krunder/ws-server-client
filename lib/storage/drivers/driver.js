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

  init() {
    throw new Error('The init() method must be implemented on storage drivers.');
  };
};

module.exports = Driver;
