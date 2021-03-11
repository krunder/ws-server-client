const Config = require('../core/config/config');
const Storage = require('../core/storage/storage');
const Client = require('../core/axios/client');

class Event {
  /**
   * Authorize the socket to call the event.
   *
   * @param {Object} socket
   * @param {Object} payload
   * @returns {Boolean}
   */
  authorize(socket, payload) {
    return true;
  };

  /**
   * Listen for the event from a socket.
   *
   * @param {Object} socket
   * @param {Object} payload
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

module.exports = Event;
