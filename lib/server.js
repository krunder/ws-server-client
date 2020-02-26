const WebSocket = require('ws');
const Response = require('./response');
const camelCase = require('camelcase');
const { v4: uuid } = require('uuid');

class Server {
  /**
   * Initialise the instance.
   *
   * @param {Object} options
   */
  constructor(options = {}) {
    /**
     * The WebSocket server instance.
     *
     * @type {WebSocket.Server|null}
     */
    this.wssServer = null;

    /**
     * The default server options.
     *
     * @type {{port: number}}
     */
    this.options = {
      port: 21001,
      events: {},
      ...options
    };
  };

  /**
   * Start the WebSocket server.
   */
  start() {
    console.log('Setting up server...');

    this.wssServer = new WebSocket.Server({
      port: this.options.port,
    });

    console.log('Listening on port ' + this.options.port + '...');

    this.wssServer.on('connection', (client) => {
      const response = this.onConnected(client);

      client.on('message', (msg) => {
        this.handleResponse(client, this.onMessage(client, msg));
      });

      this.handleResponse(client, response);
    });

    return this.wssServer;
  };

  /**
   * Check whether payload is valid.
   *
   * @param {Object} payload
   */
  validate(payload) {
    return !!payload.event && typeof payload.event === 'string';
  };

  /**
   * Handle 'connection' event.
   *
   * @param {Object} client
   * @returns {Response}
   */
  onConnected(client) {
    client.id = uuid();

    return (new Response({ socket_id: client.id })).toClient();
  };

  /**
   * Handle 'message' event.
   *
   * @param {Object} client
   * @param {String} msg
   * @return {Response}
   */
  onMessage(client, msg) {
    try {
      const payload = JSON.parse(msg) || {};

      if (!this.validate(payload)) {
        return (new Response({}, 'invalid-event')).toClient();
      }

      const event = camelCase(payload.event, { pascalCase: true });

      if (!this.options.events[event]) {
        return (new Response({}, 'invalid-event')).toClient();
      }

      return (new this.options.events[event](client, payload)).process();
    } catch (e) {
      return (new Response({}, 'invalid-format')).toClient();
    }
  };

  /**
   * Handle and send the response.
   *
   * @param {Object} client
   * @param {Response} response
   */
  handleResponse(client, response) {
    response.setClient(client);
    response.setServer(this.wssServer);
    response.send();
  };
};

module.exports = Server;
