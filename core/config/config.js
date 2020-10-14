const merge = require('deepmerge');
const dotProp = require('dot-prop');
const dotenv = require('dotenv');

class Config {
  /**
   * Initialise new instance.
   */
  constructor() {
    dotenv.config();

    this._config = require('./server');

    this.loadCustomConfig();
  };

  /**
   * Get config value by key.
   *
   * @param {String} key
   * @param {*} defaultValue
   * @returns {*}
   */
  get(key, defaultValue = null) {
    return dotProp.get(this._config, key, defaultValue);
  };

  /**
   * Load custom configuration data from applications root config directory.
   */
  loadCustomConfig() {
    try {
      const config = require(`${process.cwd()}/config/server.js`) || {};

      this._config = merge.all([this._config, config]);
    } catch (err) {
      console.info('No custom configuration file found. Reverting to default values');
    }
  };
};

module.exports = Config;
