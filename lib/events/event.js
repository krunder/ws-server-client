const Response = require('../response');
const camelCase = require('camelcase');

class Event {
  /**
   * Initialise the event instance.
   *
   * @param {Object} client
   * @param {Object} payload
   */
  constructor(client, payload) {
    /**
     * The client connection object.
     *
     * @type {Object}
     */
    this.client = client;

    /**
     * The response to be returned to the client.
     *
     * @type {Response}
     */
    this.response = new Response();
  };

  /**
   * Handle the event.
   *
   * @returns {Response}
   */
  handle() {
    const channel = camelCase(this.channel(), { pascalCase: true });

    if (this.client.channels.indexOf(channel) === -1) {
      this.messageToClient({}, 'channel-subscription-required');
    } else {
      this.process();
    }

    return this.response;
  };

  /**
   * Process the event when a client sends it.
   *
   * @throws {Error}
   */
  process() {
    throw new Error(`The process() method must be implemented on all events.`);
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
