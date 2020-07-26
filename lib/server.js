const express = require('express');
const http = require('http');
const io = require('socket.io');
const Response = require('./response');
const Storage = require('./storage/storage');
const Auth = require('./auth/auth');
const ChannelSubscriber = require('./channels/channel-subscriber');
const Loader = require('./file-system/loader');
const dotenv = require('dotenv');
const merge = require('deepmerge');
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
     * The Express HTTP instance.
     *
     * @type {express}
     * @private
     */
    this._express = express();

    /**
     * The HTTP server instance.
     *
     * @type {http|null}
     * @private
     */
    this._http = null;

    /**
     * The Socket IO server instance.
     *
     * @type {io|null}
     * @private
     */
    this._io = null;

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

      auth: {
        driver: process.env.AUTH_DRIVER,

        endpoints: {
          user: {
            url: '',
            property: 'data',
          },
        },
      },

      storage: {
        driver: process.env.STORAGE_DRIVER || 'redis',
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

    // Create HTTP server instance
    this._http = http.createServer(this._express);

    // Create Socket.IO server instance
    this._io = io(this._http);

    // Start the HTTP server
    this._http.listen(this.config.app.port);

    console.info('Listening on port ' + this.config.app.port + '...');

    this._io.on('connection', (socket) => {
      Object.values(this.events).forEach((event) => {
        socket.on(event.path, (payload) => {
          const eventClass = new require(event.fullPath)(socket, payload);
          eventClass.listen();
        });
      });
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

        const channel = require(this.channels[name].fullPath);

        const subscriber = new ChannelSubscriber(client, channel);

        if (payload.data.mode === 'subscribe') {
          return subscriber.subscribe();
        } else if (payload.data.mode === 'unsubscribe') {
          return subscriber.unsubscribe();
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

      this.config = merge.all([this.config, config]);
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
