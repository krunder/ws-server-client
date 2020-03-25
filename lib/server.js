const WebSocket = require('ws');
const Response = require('./response');
const ChannelSubscriber = require('./channels/channel-subscriber');
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

    /**
     * The channels available to subscribe/unsubscribe to.
     *
     * @type {Object}
     */
    this.channels = {};
  };


  /**
   * Initialise events and channels.
   */
  init() {
    console.info('Loading events...');
    this.registerEvents();

    console.info('Loading channels...');
    this.registerChannels();

    this.loadConfig();
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
    client.channels = [];

    return (new Response()).addMessage(Response.SEND_TYPE_CLIENT, { socket_id: client.id });
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

      if (!payload.type || typeof payload.type !== 'string') {
        return (new Response()).addMessage(Response.SEND_TYPE_CLIENT, {}, 'type-required');
      }

      if (!payload.name || typeof payload.name !== 'string') {
        return (new Response()).addMessage(Response.SEND_TYPE_CLIENT, {}, 'name-required');
      }

      const name = camelCase(payload.name, { pascalCase: true });

      if (payload.type === 'event') {
        if (!this.events[name]) {
          return (new Response()).addMessage(Response.SEND_TYPE_CLIENT, {}, 'invalid-event');
        }

        const event = require(this.events[name].fullPath);

        return (new event(client, payload)).handle();
      } else if (payload.type === 'channel') {
        if (!this.channels[name]) {
          return (new Response()).addMessage(Response.SEND_TYPE_CLIENT, {}, 'invalid-channel');
        }

        const subscriber = new ChannelSubscriber(client);

        if (payload.data.mode === 'subscribe') {
          return subscriber.subscribe(name);
        } else if (payload.data.mode === 'unsubscribe') {
          return subscriber.unsubscribe(name);
        }

        return (new Response()).addMessage(Response.SEND_TYPE_CLIENT, {}, 'invalid-mode');
      }

      return (new Response()).addMessage(Response.SEND_TYPE_CLIENT, {}, 'invalid-type');
    } catch (e) {
      return (new Response()).addMessage(Response.SEND_TYPE_CLIENT, {}, 'invalid-format');
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
    response.setServer(this);
    response.send();
  };

  /**
   * Load configuration values from application.
   */
  loadConfig() {
    try {
      const config = require(`${process.cwd()}/config/server.js`) || {};

      this.options = {...this.options, ...config};
    } catch (err) {
      console.info('Custom configuration file could not be found. Reverting to default values.');
    }
  };

  /**
   * Register channels from application channels directory.
   */
  registerEvents() {
    const eventLoader = new Loader('events');
    eventLoader.fromDir('', (files) => {
      this.events = files.reduce((prev, file) => {
        const event = camelCase(file.name, { pascalCase: true });
        return {...prev, [event]: file};
      }, {});
    });
  };

  /**
   * Register channels from application channels directory.
   */
  registerChannels() {
    const channelLoader = new Loader('channels');
    channelLoader.fromDir('', (files) => {
      this.channels = files.reduce((prev, file) => {
        const channel = camelCase(file.name, { pascalCase: true });
        return {...prev, [channel]: file};
      }, {});
    });
  };

  /**
   * Get WebSocket server instance.
   *
   * @returns {WebSocket.Server}
   */
  getWssServer() {
    return this.wssServer;
  };
};

module.exports = Server;
