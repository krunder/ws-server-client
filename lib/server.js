const express = require('express');
const http = require('http');
const io = require('socket.io');
const dotenv = require('dotenv');
const merge = require('deepmerge');

const Storage = require('../core/storage/storage');
const Loader = require('../core/file-system/loader');
const Auth = require('../core/auth/auth');
const AuthManager = require('../core/auth/auth-manager');

class Server {
  /**
   * Initialise the instance.
   */
  constructor() {
    dotenv.config();

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
     * The auth manager instance.
     *
     * @type {AuthManager|null}
     */
    this.authManager = null;

    /**
     * The default server configuration.
     *
     * @type {Object}
     */
    this.config = require('../core/config/server');

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
  init() {
    this.loadConfig();

    this.authManager = new AuthManager(this.config);
    this.storage = new Storage(this.config);
  };

  /**
   * Start the WebSocket server.
   */
  async start() {
    // Initialise data
    this.init();

    // Create HTTP server instance
    this._http = http.createServer(this._express);

    // Create Socket.IO server instance
    this._io = io(this._http, {
      handlePreflightRequest: (req, res) => {
        res.writeHead(200, {
          'Access-Control-Allow-Headers': 'Authorization',
          'Access-Control-Allow-Methods': this.config.cors.methods,
          'Access-Control-Allow-Origin': this.config.cors.origin,
          'Access-Control-Allow-Credentials': this.config.cors.credentials,
        });
        res.end();
      },
    });

    this.registerAuth();

    // Register namespaces and events
    await this.registerNamespaces();
    await this.registerEvents();

    // Start the HTTP server
    this._http.listen(this.config.app.port, () => {
      console.info('Listening on port ' + this.config.app.port + '...');
    });

    return this._io;
  };

  /**
   * Register authentication.
   */
  registerAuth() {
    console.log('Registering authentication...');

    this._io.use((socket, next) => {
      const token = socket.handshake.headers.authorization
        ? socket.handshake.headers.authorization.replace('Bearer ', '')
        : null;

      const auth = new Auth();

      if (token) {
        this.authManager.getUser(token).then((user) => {
          auth.setUser(user);
          auth.setToken(token);

          socket.request.auth = auth;

          return next();
        }).catch((err) => {
          if (!err.response || err.response.status !== 401) {
            throw new Error(err);
          }

          socket.request.auth = auth;
        });
      } else {
        socket.request.auth = auth;

        return next();
      }
    });
  };

  /**
   * Register Socket.IO namespaces.
   *
   * @returns {Promise<void>}
   */
  async registerNamespaces() {
    console.log('Registering namespaces...');

    this.namespaces = await this.load('namespaces');

    // Initialise all events relating to namespaces
    Object.values(this.namespaces).forEach(namespace => {
      this._io.of(`/${namespace.path}`).on('connection', socket => {
        if (namespace.instance.authorize(socket)){
          Object.values(this.events)
            .filter(event => !!event.instance.namespace())
            .forEach(event => this.handleEvent(event, socket));

          return namespace.instance.connect(socket);
        }

        setTimeout(() => socket.disconnect(true));
      });
    });
  };

  /**
   * Register Socket.IO events.
   *
   * @returns {Promise<void>}
   */
  async registerEvents() {
    console.log('Registering events...');

    this.events = await this.load('events');

    this._io.on('connection', socket => {
      // Initialise all events that have no namespace
      Object.values(this.events)
        .filter(event => !event.instance.namespace())
        .forEach(event => this.handleEvent(event, socket));
    });
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
   * Load data from application directory.
   *
   * @returns {Promise}
   */
  load(dir) {
    const loader = new Loader(dir);

    return new Promise((resolve) => {
      loader.fromDir('', (files) => {
        const data = files.reduce((prev, file) => {
          const instance = new (require(file.fullPath))(this.config);

          return {...prev, [instance.getName()]: { ...file, instance }};
        }, {});

        resolve(data);
      });
    });
  };

  /**
   * Handle single event.
   *
   * @param {Object} event
   * @param {Object} socket
   */
  handleEvent(event, socket) {
    socket.on(event.path, (payload, callback) => {
      if (!event.instance.authorize()) {
        return callback({ error: 'unauthorized' });
      }

      return callback(event.instance.listen(socket, payload));
    });
  };
};

module.exports = Server;
