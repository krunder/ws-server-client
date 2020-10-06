const Storage = require('../../core/storage/storage');
const camelCase = require('camelcase');

class Event {
  /**
   * Initialise the event instance.
   *
   * @param {Object} config
   */
  constructor(config) {
    /**
     * The configuration object.
     *
     * @type {Object}
     */
    this.config = config;

    /**
     * The storage instance.
     */
    this.storage = new Storage(this.config);
  };

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
    return false;
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
