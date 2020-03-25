const Response = require('../response');

class ChannelSubscriber {
  /**
   * Initialise the subscriber instance.
   *
   * @param {Object} client
   */
  constructor(client) {
    this.client = client;

    /**
     * The response to be returned to the client.
     *
     * @type {Response}
     */
    this.response = new Response();
  };

  /**
   * Subscribe to channel.
   *
   * @param {String} channel
   * @return {Response}
   */
  subscribe(channel) {
    if (this.client.channels.indexOf(channel) !== -1) {
      return this.response.addMessage(Response.SEND_TYPE_CLIENT, {}, 'already-subscribed');
    }

    this.client.channels = [...this.client.channels, channel];

    return this.response.addMessage(Response.SEND_TYPE_CLIENT);
  };

  /**
   * Unsubscribe from channel.
   *
   * @param {String} channel
   * @return {Response}
   */
  unsubscribe(channel) {
    const index = this.client.channels.indexOf(channel);

    if (index === -1) {
      return this.response.addMessage(Response.SEND_TYPE_CLIENT, {}, 'not-subscribed');
    }

    this.client.channels.splice(index, 1);

    return this.response.addMessage(Response.SEND_TYPE_CLIENT);
  };
};

module.exports = ChannelSubscriber;
