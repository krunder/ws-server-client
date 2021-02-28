const Config = require('../core/config/config');
const Server = require('../core/server');
const Storage = require('../core/storage/storage');
const Client = require('../core/axios/client');

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

    /**
     * The HTTP client instance.
     *
     * @type {Client}
     */
    this.http = null;
  };

  /**
   * Initialize the application.
   *
   * @param {Function} callback
   */
  init(callback) {};

  /**
   * Handle 'connection' event on Socket.IO.
   *
   * @param {Object} socket
   * @param {Object} options
   */
  onConnect(socket, options) {};

  /**
   * Handle 'disconnect' event on Socket.IO.
   *
   * @param {Object} socket
   */
  onDisconnect(socket) {};

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

  /**
   * Set HTTP client instance.
   *
   * @param {Client} http
   */
  setHttp(http) {
    this.http = http;
  };

  /**
   * Get HTTP client instance.
   *
   * @returns {Client|null}
   */
  getHttp() {
    return this.http;
  };
}

module.exports = Application;
