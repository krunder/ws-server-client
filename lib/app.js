const Config = require('../core/config/config');
const Server = require('../core/server');
const Storage = require('../core/storage/storage');

class Application {
  /**
   * Initialise new instance.
   *
   * @param {Config} config
   */
  constructor(config) {
    this.config = config;

    /**
     * The server instance.
     *
     * @type {Server|null}
     */
    this.server = null;

    /**
     * The storage instance.
     *
     * @type {Storage|null}
     */
    this.storage = null;
  };

  /**
   * Set server instance
   *
   * @param {Server} server
   */
  setServer(server) {
    this.server = server;
  };

  /**
   * Get server instance.
   *
   * @returns {Server|null}
   */
  getServer() {
    return this.server;
  };

  /**
   * Set storage instance.
   *
   * @param {Storage} storage
   */
  setStorage(storage) {
    this.storage = storage;
  };

  /**
   * Get storage instance.
   *
   * @returns {Storage|null}
   */
  getStorage() {
    return this.storage;
  };
};

module.exports = Application;
