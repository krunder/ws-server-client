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

    /**
     * The configuration object.
     *
     * @type {Object}
     */
    this.config = {};
  };

  /**
   * Handle authorization of the client.
   *
   * @returns {Boolean}
   */
  authorize() {
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
   * Set configuration object.
   *
   * @param {Object} config
   */
  setConfig(config) {
    this.config = config;
  };

  /**
   * Get configuration object.
   *
   * @returns {Object}
   */
  getConfig() {
    return this.config;
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
