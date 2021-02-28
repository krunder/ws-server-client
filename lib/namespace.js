const Config = require('../core/config/config');
const Storage = require('../core/storage/storage');

class Namespace {
  /**
   * Authorize the socket to connect to the namespace.
   *
   * @returns {Boolean}
   */
  authorize(socket) {
    return true;
  };

  /**
   * Callback for the 'connect' event from a socket.
   *
   * @param {Object} socket
   * @param {Object} options
   * @return {Object|String|Number}
   * @throws {Error}
   */
  connect(socket, options) {};

  /**
   * Callback for the 'disconnect' event from a socket.
   *
   * @param {Object} socket
   * @throws {Error}
   */
  disconnect(socket) {};

  /**
   * Set config instance.
   *
   * @param {Config} config
   */
  setConfig(config) {
    this.config = config;
  };

  /**
   * Get config instance.
   *
   * @return {Config}
   */
  getConfig() {
    return this.config;
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
   * @param {Storage} storage
   */
  getStorage(storage) {
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

  /**
   * Set application instance.
   *
   * @param {Application} app
   */
  setApp(app) {
    this.app = app;
  };

  /**
   * Get application instance.
   *
   * @param {Application} app
   */
  getApp(app) {
    return this.app;
  };
};

module.exports = Namespace;
