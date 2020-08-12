const Storage = require('../../core/storage/storage');

class Namespace {
  /**
   * Initialise the namespace instance.
   *
   * @param {Object} config
   */
  constructor(config) {
    /**
     * The configuration object.
     *
     * @type {Object}
     */
    this.config = config;

    /**
     * The storage instance.
     */
    this.storage = new Storage(this.config);
  };

  /**
   * Callback for the 'connect' event from a socket.
   *
   * @param {Object} socket
   * @return {Object|String|Number}
   * @throws {Error}
   */
  connect(socket) {};
};

module.exports = Namespace;
