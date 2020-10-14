const Config = require('../config/config');

class Storage {
  /**
   * Initialise new instance.
   *
   * @param {Config} config
   */
  constructor(config) {
    this.config = config;

    /**
     * The storage driver instance.
     *
     * @type {Driver}
     * @private
     */
    this._driver = new (require(`./drivers/${this.config.get('storage.driver')}`))(this.config);
  };

  /**
   * Set value in storage driver.
   *
   * @param {String} key
   * @param {*} value
   */
  set(key, value) {
    return this._driver.set(key, value);
  };

  /**
   * Get value from storage driver.
   *
   * @param {String} key
   */
  get(key) {
    return this._driver.get(key);
  };

  /**
   * Get the configuration instance.
   *
   * @returns {Config}
   */
  getConfig() {
    return this.config;
  };

  /**
   * Set driver instance.
   *
   * @param {Driver} driver
   */
  setDriver(driver) {
    this._driver = driver;
  };

  /**
   * Get driver instance.
   *
   * @return {Driver}
   */
  getDriver() {
    return this.driver;
  };
};

module.exports = Storage;
