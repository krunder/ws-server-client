const Config = require('../../core/config/config');
const Storage = require('../../core/storage/storage');
const camelCase = require('camelcase');

class Event {
  /**
   * Authorize the socket to call the event.
   *
   * @returns {Boolean}
   */
  authorize(socket, payload) {
    return true;
  };

  /**
   * Listen for the event from a socket.
   *
   * @return {Object|String|Number}
   * @throws {Error}
   */
  listen(socket, payload) {
    throw new Error(`The listen() method must be implemented on all events.`);
  };

  /**
   * The namespace the event should listen on.
   *
   * @return {String}
   * @throws {Error}
   */
  namespace() {
    return '';
  };

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
   * Get event name formatted as camel case.
   *
   * @returns {String}
   */
  getName() {
    return camelCase(this.constructor.name, { pascalCase: true });
  };
};

module.exports = Event;
