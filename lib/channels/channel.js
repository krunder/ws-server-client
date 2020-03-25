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
  };

  /**
   * Get the client subscribing/un-subscribing.
   *
   * @returns {Object}
   */
  getClient() {
    return this.client;
  };
};

module.exports = Channel;
