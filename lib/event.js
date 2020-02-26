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
   * The currently connected client.
   *
   * @returns {Object}
   */
  getClient() {
    return this.client;
  }
};

module.exports = Event;
