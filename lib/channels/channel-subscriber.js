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

    // Check whether client is authorized to subscribe.
    if (!this.channel.authorize()) {
      return this.response.toClient({}, 'unauthorized');
    }

    // Check whether client is already subscribed.
    if (this.client.channels.indexOf(name) !== -1) {
      return this.response.toClient({}, 'already-subscribed');
    }

    // Add channel to list of channels client is subscribed to.
    this.client.channels = [...this.client.channels, name];

    // Return empty success response back to client.
    return this.response.toClient();
  };

  /**
   * Unsubscribe from channel.
   *
   * @return {Response}
   */
  unsubscribe() {
    const name = this.channel.getName();

    // Get index from list of clients subscribed channels.
    const index = this.client.channels.indexOf(name);

    // Check whether client is already subscribed.
    if (index === -1) {
      return this.response.toClient({}, 'not-subscribed');
    }

    // Remove channel from list of channels client is subscribed to.
    this.client.channels.splice(index, 1);

    // Return empty success response back to client.
    return this.response.toClient();
  };
};

module.exports = ChannelSubscriber;
