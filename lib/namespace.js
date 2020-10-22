const Config = require('../core/config/config');
const Storage = require('../core/storage/storage');
const camelCase = require('camelcase');

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
   * Get namespace name formatted as camel case.
   *
   * @returns {String}
   */
  getName() {
    return camelCase(this.constructor.name, { pascalCase: true });
  };
};

module.exports = Namespace;
