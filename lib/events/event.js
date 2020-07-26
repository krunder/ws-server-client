const Response = require('../response');
const Storage = require('../../core/storage/storage');
const camelCase = require('camelcase');

class Event {
  /**
   * Initialise the event instance.
   *
   * @param {Object} socket
   * @param {Object} payload
   */
  constructor(socket, payload) {
    /**
     * The socket object.
     *
     * @type {Object}
     */
    this.socket = socket;

    /**
     * The payload sent with the event.
     *
     * @type {Object}
     */
    this.payload = payload;

    /**
     * The response instance.
     *
     * @type {Response}
     */
    this.response = new Response();

    /**
     * The storage instance.
     */
    this.storage = new Storage();
  };

  /**
   * Listen for the event from a socket.
   *
   * @return {Response}
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
  channel() {
    throw new Error(`The channel() method must be implemented on all events.`);
  };

  messageToAll(data = {}, errorType = '') {
    this.response.addMessage(Response.SEND_TYPE_ALL, data, errorType);
    return this;
  };

  messageToOthers(data = {}, errorType = '') {
    this.response.addMessage(Response.SEND_TYPE_OTHERS, data, errorType);
    return this;
  };

  messageToClient(data = {}, errorType = '') {
    this.response.addMessage(Response.SEND_TYPE_CLIENT, data, errorType);
    return this;
  };

  /**
   * The currently connected client.
   *
   * @return {Object}
   */
  getClient() {
    return this.client;
  };
};

module.exports = Event;
