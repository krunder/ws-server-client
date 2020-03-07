const WebSocket = require('ws');
const Response = require('./response');
const Loader = require('./file-system/loader');
const camelCase = require('camelcase');
const { v4: uuid } = require('uuid');

class Server {
  /**
   * Initialise the instance.
   */
  constructor() {
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
      port: 21000,
    };

    /**
     * The events available to receive payload to.
     *
     * @type {Object}
     */
    this.events = {};
  };


  /**
   * Initialise events and channels.
   */
  init() {
    console.info('Preloading events...');

    const loader = new Loader('events');
    loader.fromDir('', (files) => {
      this.events = files.reduce((prev, file) => {
        const event = camelCase(file.name, { pascalCase: true });

        return {...prev, [event]: file};
      }, {});
    });
  };

  /**
   * Start the WebSocket server.
   */
  start() {
    console.info('Starting server...');

    this.wssServer = new WebSocket.Server({
      port: this.options.port,
    });

    console.info('Listening on port ' + this.options.port + '...');

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
   * Handle 'connection' event.
   *
   * @param {Object} client
   * @return {Response}
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

      if (!payload.event || typeof payload.event !== 'string') {
        return (new Response({}, 'event-required')).toClient();
      }

      const eventName = camelCase(payload.event, { pascalCase: true });

      if (!this.events[eventName]) {
        return (new Response({}, 'invalid-event')).toClient();
      }

      const event = require(this.events[eventName].fullPath);

      return (new event(client, payload)).process();
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
