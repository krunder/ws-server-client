const Response = require('../response');

class ChannelSubscriber {
  /**
   * Initialise the subscriber instance.
   *
   * @param {Object} client
   */
  constructor(client) {
    this.client = client;
  };

  /**
   * Subscribe to channel.
   *
   * @param {String} channel
   * @return {Response}
   */
  subscribe(channel) {
    if (this.client.channels.indexOf(channel) !== -1) {
      return (new Response({}, 'already-subscribed')).toClient();
    }

    this.client.channels = [...this.client.channels, channel];

    return (new Response()).toClient();
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
      return (new Response({}, 'not-subscribed')).toClient();
    }

    this.client.channels.splice(index, 1);

    return (new Response()).toClient();
  };
};

module.exports = ChannelSubscriber;
