const WebSocket = require('ws');

class Response {
  /**
   * Initialise the response.
   */
  constructor() {
    /**
     * The socket which the response corresponds around.
     *
     * @type {Object}
     */
    this._socket = null;

    /**
     * The Socket IO instance.
     *
     * @type {io}
     */
    this._io = null;

    /**
     * The messages to be sent to clients.
     *
     * @type {*[]}
     */
    this.messages = [];
  };

  /**
   * Set the socket object.
   *
   * @param {Object} socket
   */
  setSocket(socket) {
    this._socket = socket;
  };

  /**
   * Set the Socket IO instance.
   *
   * @param {io} io
   */
  setIo(io) {
    this._io = io;
  };

  /**
   * Add new message for the sockets.
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

  /**
   * Add message to send to single socket.
   *
   * @param {Object} data
   * @param {String} errorType
   * @returns {Response}
   */
  toClient(data = {}, errorType = '') {
    this.addMessage(Response.SEND_TYPE_CLIENT, data, errorType);
    return this;
  };

  /**
   * Add message to send to all other sockets.
   *
   * @param {Object} data
   * @param {String} errorType
   * @returns {Response}
   */
  toOthers(data = {}, errorType = '') {
    this.addMessage(Response.SEND_TYPE_OTHERS, data, errorType);
    return this;
  };

  /**
   * Add message to send to all sockets.
   *
   * @param {Object} data
   * @param {String} errorType
   * @returns {Response}
   */
  toAll(data = {}, errorType = '') {
    this.addMessage(Response.SEND_TYPE_ALL, data, errorType);
    return this;
  };

  /**
   * Send all response payloads.
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
