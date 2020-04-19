class Channel {
  /**
   * Initialise the event instance.
   *
   * @param {Object} client
   */
  constructor(client) {
    /**
     * The client connection object.
     *
     * @type {Object}
     */
    this.client = client;

    /**
     * The name of the channel.
     */
    this.name = '';
  };

  /**
   * Check whether channel requires authentication to subscribe.
   *
   * @returns {Boolean}
   */
  requiresAuthentication() {
    return true;
  };

  /**
   * Set name of the channel.
   *
   * @param {String} name
   */
  setName(name) {
    this.name = name;
  };

  /**
   * Get name of the channel.
   *
   * @returns {String}
   */
  getName() {
    return this.name;
  };

  /**
   * Get the client subscribing/un-subscribing.
   *
   * @return {Object}
   */
  getClient() {
    return this.client;
  };
};

module.exports = Channel;
