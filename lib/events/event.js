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
     * The payload from the request.
     *
     * @type {Object}
     */
    this.payload = payload || {};
  };

  /**
   * Handle the event.
   *
   * @returns {Response}
   */
  handle() {
    const channel = camelCase(this.channel(), { pascalCase: true });

    if (this.client.channels.indexOf(channel) === -1) {
      return (new Response({}, 'channel-subscription-required')).toClient();
    }

    return this.process();
  };

  /**
   * Process the event when a client sends it.
   *
   * @return {Response}
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

  /**
   * The currently connected client.
   *
   * @return {Object}
   */
  getClient() {
    return this.client;
  };

  /**
   * The payload object sent with the request.
   *
   * @return {Object}
   */
  getPayload() {
    return this.payload;
  };
};

module.exports = Event;
