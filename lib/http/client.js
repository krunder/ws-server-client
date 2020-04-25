const axios = require('axios');

class Client {
  constructor() {
    this._client = axios.create({
      timeout: 30000, // 30 seconds
    });
  };

  /**
   * Send GET request.
   *
   * @param {String} uri
   * @param {Object} config
   * @returns {Promise}
   */
  get(uri, config) {
    return this._client.get(uri, config);
  };

  /**
   * Send POST request.
   *
   * @param {String} uri
   * @param {Object} data
   * @param {Object} config
   * @returns {Promise}
   */
  post(uri, data, config) {
    return this._client.post(uri, data, config);
  };

  /**
   * Send PATCH request.
   *
   * @param {String} uri
   * @param {Object} data
   * @param {Object} config
   * @returns {Promise}
   */
  patch(uri, data, config) {
    return this._client.patch(uri, data, config);
  };

  /**
   * Send PUT request.
   *
   * @param {String} uri
   * @param {Object} data
   * @param {Object} config
   * @returns {Promise}
   */
  put(uri, data, config) {
    return this._client.put(uri, data, config);
  };

  /**
   * Send DELETE request.
   *
   * @param {String} uri
   * @param {Object} config
   * @returns {Promise}
   */
  delete(uri, config) {
    return this._client.delete(uri, config);
  };
};

module.exports = Client;
