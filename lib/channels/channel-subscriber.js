const Response = require('../response');

class ChannelSubscriber {
  /**
   * Initialise the subscriber instance.
   *
   * @param {Object} client
   * @param {Channel} channel
   */
  constructor(client, channel) {
    this.client = client;
    this.channel = channel;

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
   * @return {Response}
   */
  subscribe() {
    const name = this.channel.getName();

    if (this.client.channels.indexOf(name) !== -1) {
      return this.response.toClient({}, 'already-subscribed');
    }

    this.client.channels = [...this.client.channels, name];

    return this.response.toClient();
  };

  /**
   * Unsubscribe from channel.
   *
   * @return {Response}
   */
  unsubscribe() {
    const name = this.channel.getName();

    const index = this.client.channels.indexOf(name);

    if (index === -1) {
      return this.response.toClient({}, 'not-subscribed');
    }

    this.client.channels.splice(index, 1);

    return this.response.toClient();
  };
};

module.exports = ChannelSubscriber;
