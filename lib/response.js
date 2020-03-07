const WebSocket = require('ws');

class Response {
  /**
   * Initialise the response.
   *
   * @param {Object} data
   * @param {String} errorType
   */
  constructor(data = {}, errorType = '') {
    /**
     * The send type for whether we send to a client, everyone except the client or everyone.
     *
     * @type {String}
     */
    this.sendType = 'to_client';

    /**
     * The client who the response corresponds around.
     *
     * @type {Object}
     */
    this.client = null;

    /**
     * The WebSocket server instance.
     *
     * @type {WebSocket.Server}
     */
    this.server = null;

    /**
     * The payload data object..
     *
     * @type {Object}
     */
    this.data = data;

    /**
     * The error type if we are sending an error response.
     *
     * @type {String}
     */
    this.errorType = errorType;
  };

  /**
   * Set the client object.
   *
   * @param {Object} client
   */
  setClient(client) {
    this.client = client;
  };

  /**
   * Set the server instance.
   *
   * @param {WebSocket.Server} server
   */
  setServer(server) {
    this.server = server;
  };

  /**
   * Set response to be sent to all clients.
   */
  toAll() {
    this.sendType = 'to_all';
    return this;
  };

  /**
   * Set response to be sent to everyone except the current client.
   */
  toOthers() {
    this.sendType = 'to_others';
    return this;
  };

  /**
   * Set response to be sent to the current client.
   */
  toClient() {
    this.sendType = 'to_client';
    return this;
  };

  /**
   * Send response to single client.
   */
  send() {
    let clients = Object.values(this.server.clients);

    if (this.sendType === 'to_client') {
      this.server.clients.forEach((client) => {
        if (client.id === this.client.id && client.readyState === WebSocket.OPEN) {
          client.send(this.getPayload());
        }
      });
    } else if (this.sendType === 'to_others') {
      this.server.clients.forEach((client) => {
        if (client.id !== this.client.id && client.readyState === WebSocket.OPEN) {
          client.send(this.getPayload());
        }
      });
    } else if (this.sendType === 'to_all') {
      this.server.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(this.getPayload());
        }
      });
    }
  };

  /**
   * Get payload based off data and success.
   *
   * @return String
   */
  getPayload() {
    const payload = {
      status: !!this.errorType ? 'error' : 'ok',
      data: this.data,
    };

    return JSON.stringify(!!this.errorType ? { ...payload, errorType: this.errorType } : payload);
  };
};

module.exports = Response;
