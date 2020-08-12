const Storage = require('../../core/storage/storage');

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
};

module.exports = Event;
