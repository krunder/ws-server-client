class Storage {
  /**
   * Initialise the storage instance.
   *
   * @param {Object} config
   */
  constructor(config) {
    this.config = config;
    this.driver = new (require(`./drivers/${this.config.storage.driver}`))(config);
  };

  /**
   * Get the storage driver instance.
   *
   * @return {Driver}
   */
  getDriver() {
    return this.driver;
  };
};

module.exports = Storage;
