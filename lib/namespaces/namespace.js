const Storage = require('../../core/storage/storage');
const camelCase = require('camelcase');

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
   * Authorize the socket to connect to the namespace.
   *
   * @returns {Boolean}
   */
  authorize(socket) {
    return true;
  };

  /**
   * Callback for the 'connect' event from a socket.
   *
   * @param {Object} socket
   * @return {Object|String|Number}
   * @throws {Error}
   */
  connect(socket) {};

  /**
   * Get namespace name formatted as camel case.
   *
   * @returns {String}
   */
  getName() {
    return camelCase(this.constructor.name, { pascalCase: true });
  };
};

module.exports = Namespace;
