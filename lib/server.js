const express = require('express');
const http = require('http');
const io = require('socket.io');
const Response = require('./response');
const Storage = require('../core/storage/storage');
const Loader = require('../core/file-system/loader');
const dotenv = require('dotenv');
const merge = require('deepmerge');
const camelCase = require('camelcase');

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
     * The namespaces available to gain a connection.
     *
     * @type {Object}
     */
    this.namespaces = {};
  };


  /**
   * Initialise events and channels.
   */
  init(callback) {
    this.loadConfig();
    this.loadEvents();
    this.loadNamespaces().then(callback).catch(err => { throw err; });

    this.storage = new Storage(this.config);
  };

  /**
   * Start the WebSocket server.
   */
  start() {
    // Create HTTP server instance
    this._http = http.createServer(this._express);

    // Create Socket.IO server instance
    this._io = io(this._http);

    // Initialise data
    this.init(() => {
      // Start the HTTP server
      this._http.listen(this.config.app.port);

      console.info('Listening on port ' + this.config.app.port + '...');

      // Setup socket event handlers
      this._io.on('connection', (socket) => {
        Object.values(this.events).forEach(event => {
          socket.on(event.path, (payload, callback) => {
            const response = event.instance
              .setSocket(socket)
              .setPayload(payload)
              .listen();

            callback(response);
          });
        });
      });

      Object.values(this.namespaces).forEach(namespace => {
        this._io.of(`/${namespace.path}`).on('connection', namespace.instance.connect);
      });
    });

    return this._io;
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
   * Register events from application events directory.
   */
  loadEvents() {
    const eventLoader = new Loader('events');

    return new Promise((resolve, reject) => {
      eventLoader.fromDir('', (files) => {
        this.events = files.reduce((prev, file) => {
          const name = camelCase(file.name, { pascalCase: true });

          const instance = new (require(file.fullPath))(this.config);

          return {...prev, [name]: { ...file, instance }};
        }, {});

        resolve(this.events);
      });
    });
  };

  /**
   * Register namespaces from application namespaces directory.
   */
  loadNamespaces() {
    const namespaceLoader = new Loader('namespaces');

    return new Promise((resolve, reject) => {
      namespaceLoader.fromDir('', files => {
        this.namespaces = files.reduce((prev, file) => {
          const name = camelCase(file.name, { pascalCase: true });

          const instance = new (require(file.fullPath))(this.config);

          return {...prev, [name]: { ...file, instance }};
        }, {});

        resolve(this.namespaces);
      });
    });
  };
};

module.exports = Server;
