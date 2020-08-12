const Storage = require('../../core/storage/storage');

class Event {
  /**
   * Initialise the event instance.
   *
   * @param {Object} config
   */
  constructor(config) {
    /**
     * The socket object.
     *
     * @type {Object}
     */
    this.socket = null;

    /**
     * The payload sent with the event.
     *
     * @type {Object}
     */
    this.payload = null;

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
  listen() {
    throw new Error(`The listen() method must be implemented on all events.`);
  };

  /**
   * The channel the event should listen on.
   *
   * @return {String}
   * @throws {Error}
   */
  channel() {};

  /**
   * Set socket object.
   *
   * @param {Object} socket
   */
  setSocket(socket) {
    this.socket = socket;
    return this;
  };

  /**
   * Set payload data object.
   *
   * @param {Object} payload
   */
  setPayload(payload) {
    this.payload = payload;
    return this;
  };
};

module.exports = Event;
