const express = require('express');
const http = require('http');
const io = require('socket.io');

const Config = require('./config/config');
const Loader = require('./file-system/loader');
const AuthManager = require('./auth/auth-manager');
const Storage = require('./storage/storage');
const Client = require('./axios/client');
const Application = require('../lib/app');

class Server {
  /**
   * Initialise the instance.
   *
   * @param {Config} config
   */
  constructor(config) {
    this.config = config;

    /**
     * The storage instance.
     *
     * @type {Storage|null}
     */
    this.storage = null;

    /**
     * The HTTP client instance.
     *
     * @type {Client|null}
     */
    this.http = null;

    /**
     * The application instance.
     *
     * @type {Application|null}
     */
    this.app = null;

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
     * @type {http}
     * @private
     */
    this._httpServer = http.createServer(this._express);

    /**
     * The Socket IO server instance.
     *
     * @type {io|null}
     * @private
     */
    this._io = null;

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
  async init(callback) {
    // Create Socket.IO server instance
    this._io = io(this._httpServer, {
      handlePreflightRequest: (req, res) => {
        res.writeHead(200, {
          'Access-Control-Allow-Headers': 'Authorization',
          'Access-Control-Allow-Methods': this.config.get('cors.methods'),
          'Access-Control-Allow-Origin': this.config.get('cors.origin'),
          'Access-Control-Allow-Credentials': this.config.get('cors.credentials'),
        });
        res.end();
      },
    });

    // Register authentication
    this.registerAuth();

    // Register namespaces and events
    await this.registerEvents();
    await this.registerNamespaces();

    callback();
  };

  /**
   * Start the WebSocket server.
   */
  start() {
    const port = this.config.get('app.port');

    this._httpServer.listen(port, () => {
      console.info('Listening on port ' + port + '...');
    });
  };

  /**
   * Register authentication.
   */
  registerAuth() {
    console.info('Registering authentication...');

    this._io.use((socket, next) => {
      const authManager = new AuthManager(this.config);

      const token = socket.handshake.headers.authorization
        ? socket.handshake.headers.authorization.replace('Bearer ', '')
        : null;

      if (token) {
        authManager.fetchUserByToken(token, () => {
          socket.request.auth = authManager.getAuthUser();
          return next();
        });
      } else {
        socket.request.auth = authManager.getAuthUser();
        return next();
      }
    });
  };

  /**
   * Register Socket.IO events.
   */
  async registerEvents() {
    console.info('Registering events...');

    this.events = await this.load('events');

    // Initialise all events that have no namespace
    this._io.on('connection', socket => {
      this.app.onConnect(socket, { query: socket.handshake.query });

      Object.values(this.events)
        .filter(event => !event.instance.namespace())
        .forEach(event => this.handleEvent(event, socket));

      socket.on('disconnect', () => this.app.onDisconnect(socket));
    });
  };

  /**
   * Register Socket.IO namespaces.
   */
  async registerNamespaces() {
    console.info('Registering namespaces...');

    this.namespaces = await this.load('namespaces');

    // Initialise all events relating to namespaces
    Object.values(this.namespaces).forEach(namespace => {
      this._io.of(`/${namespace.path}`).on('connection', socket => {
        if (namespace.instance.authorize(socket)) {
          this.app.onConnect(socket, { query: socket.handshake.query });

          Object.values(this.events)
            .filter(event => event.instance.namespace() === namespace.path)
            .forEach(event => this.handleEvent(event, socket));

          socket.on('disconnect', () => {
            this.app.onDisconnect(socket);
            namespace.instance.disconnect(socket);
          });

          return namespace.instance.connect(socket, { query: socket.handshake.query });
        }

        setTimeout(() => socket.disconnect(true));
      });
    });
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
          const instance = new (require(file.fullPath));
          instance.setConfig(this.config);
          instance.setStorage(this.storage);
          instance.setHttp(this.http);
          instance.setApp(this.app);

          return {...prev, [file.path]: { ...file, instance }};
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
      if (event.instance.authorize(socket, payload)) {
        const result = event.instance.listen(socket, payload);

        return result instanceof Promise ? result.then(callback) : callback(result);
      }

      return callback({ error: 'Unauthorized' });
    });
  };

  /**
   * Set application instance.
   *
   * @param {Application} app
   */
  setApp(app) {
    this.app = app;
  };

  /**
   * Get application instance.
   *
   * @returns {Application}
   */
  getApp() {
    return this.app;
  };

  /**
   * Get Socket.IO server instance.
   *
   * @returns {io|null}
   */
  getIO() {
    return this._io;
  };

  /**
   * Set storage instance.
   *
   * @param {Storage} storage
   */
  setStorage(storage) {
    this.storage = storage;
  };

  /**
   * Get storage instance.
   *
   * @param {Storage} storage
   */
  getStorage(storage) {
    return this.storage;
  };

  /**
   * Set HTTP client instance.
   *
   * @param {Client} http
   */
  setHttp(http) {
    this.http = http;
  };

  /**
   * Get HTTP client instance.
   *
   * @returns {Client|null}
   */
  getHttp() {
    return this.http;
  };
}

module.exports = Server;
