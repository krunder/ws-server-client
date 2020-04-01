const WebSocket = require('ws');

class Response {
  /**
   * Initialise the response.
   */
  constructor() {
    /**
     * The client who the response corresponds around.
     *
     * @type {Object}
     */
    this.client = null;

    /**
     * The WebSocket server instance.
     *
     * @type {Server}
     */
    this.server = null;

    /**
     * The messages to be sent to clients.
     *
     * @type {*[]}
     */
    this.messages = [];
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
   * @param {Server} server
   */
  setServer(server) {
    this.server = server;
  };

  /**
   * Add new message for the clients.
   *
   * @param {String} sendType
   * @param {Object} data
   * @param {String} errorType
   */
  addMessage(sendType, data = {}, errorType = '') {
    this.messages.push({
      sendType,
      data,
      errorType,
    });
    return this;
  };

  toClient(data = {}, errorType = '') {
    this.addMessage(Response.SEND_TYPE_CLIENT, data, errorType);
    return this;
  };

  toOthers(data = {}, errorType = '') {
    this.addMessage(Response.SEND_TYPE_OTHERS, data, errorType);
    return this;
  };

  toAll(data = {}, errorType = '') {
    this.addMessage(Response.SEND_TYPE_ALL, data, errorType);
    return this;
  };

  /**
   * Send response to single client.
   */
  send() {
    for (let i = 0; i < this.messages.length; i++) {
      const message = this.messages[i];

      if (message.sendType === Response.SEND_TYPE_CLIENT) {
        this.server.getWssServer().clients.forEach((client) => {
          if (client.id === this.client.id && client.readyState === WebSocket.OPEN) {
            client.send(this.getPayload(message));
          }
        });
      } else if (message.sendType === Response.SEND_TYPE_OTHERS) {
        this.server.getWssServer().clients.forEach((client) => {
          if (client.id !== this.client.id && client.readyState === WebSocket.OPEN) {
            client.send(this.getPayload(message));
          }
        });
      } else if (message.sendType === Response.SEND_TYPE_ALL) {
        this.server.getWssServer().clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(this.getPayload(message));
          }
        });
      }
    }
  };

  /**
   * Get payload based off data and success.
   *
   * @param {Object} message
   * @return {String}
   */
  getPayload(message) {
    const payload = {
      status: !!message.errorType ? 'error' : 'ok',
      data: message.data,
    };

    return JSON.stringify(!!message.errorType ? { ...payload, errorType: message.errorType } : payload);
  };
};

Response.SEND_TYPE_ALL = 'to_all';
Response.SEND_TYPE_OTHERS = 'to_others';
Response.SEND_TYPE_CLIENT = 'to_client';

module.exports = Response;
