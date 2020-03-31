const WebSocket = require('ws');
const Response = require('./response');
const Storage = require('./storage/storage');
const ChannelSubscriber = require('./channels/channel-subscriber');
const Loader = require('./file-system/loader');
const dotenv = require('dotenv');
const camelCase = require('camelcase');
const { v4: uuid } = require('uuid');

class Server {
  /**
   * Initialise the instance.
   */
  constructor() {
    dotenv.config();

    const environment = process.env.APP_ENV || 'local';

    /**
     * The WebSocket server instance.
     *
     * @type {WebSocket.Server|null}
     */
    this.wssServer = null;

    /**
     * The default server configuration.
     *
     * @type {{port: number}}
     */
    this.config = {
      app: {
        environment,
        port: process.env.APP_PORT || 21000,
      },

      storage: {
        driver: process.env.STORAGE_DRIVER || 'file',
        prefix: `${environment}_`,
      },

      redis: {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD,
        path: process.env.REDIS_UNIX_PATH,
      },
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
    this.loadConfig();
    this.loadEvents();
    this.loadChannels();

    this.storage = new Storage(this.config);
  };

  /**
   * Start the WebSocket server.
   */
  start() {
    this.init();

    this.wssServer = new WebSocket.Server({
      port: this.config.app.port,
    });

    console.info('Listening on port ' + this.config.app.port + '...');

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

    return (new Response()).toClient({ socket_id: client.id });
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
        return (new Response()).toClient({}, 'type-required');
      }

      if (!payload.name || typeof payload.name !== 'string') {
        return (new Response()).toClient({}, 'name-required');
      }

      const name = camelCase(payload.name, { pascalCase: true });

      if (payload.type === 'event') {
        if (!this.events[name]) {
          return (new Response()).toClient({}, 'invalid-event');
        }

        const event = require(this.events[name].fullPath);

        return (new event(client, payload)).handle();
      } else if (payload.type === 'channel') {
        if (!this.channels[name]) {
          return (new Response()).toClient({}, 'invalid-channel');
        }

        const subscriber = new ChannelSubscriber(client);

        if (payload.data.mode === 'subscribe') {
          return subscriber.subscribe(name);
        } else if (payload.data.mode === 'unsubscribe') {
          return subscriber.unsubscribe(name);
        }

        return (new Response()).toClient({}, 'invalid-mode');
      }

      return (new Response()).toClient({}, 'invalid-type');
    } catch (e) {
      return (new Response()).toClient({}, 'invalid-format');
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

      this.config = {...this.config, ...config};
    } catch (err) {
      console.info('Custom configuration file could not be found. Reverting to default values.');
    }
  };

  /**
   * Register channels from application channels directory.
   */
  loadEvents() {
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
  loadChannels() {
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
   * @return {WebSocket.Server}
   */
  getWssServer() {
    return this.wssServer;
  };
};

module.exports = Server;
