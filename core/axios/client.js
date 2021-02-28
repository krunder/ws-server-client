const axios = require('axios');

class Client {
  constructor(config) {
    this._client = axios.create({
      timeout: 30000, // 30 seconds
      baseURL: config && config.get('api.url'),
    });

    /**
     * The extra headers to be applied on each request.
     *
     * @type {Object}
     * @private
     */
    this._headers = {};
  };

  /**
   * Send GET request.
   *
   * @param {String} uri
   * @param {Object} options
   * @returns {Promise}
   */
  get(uri, options = {}) {
    return this._client.get(uri, {
      headers: this._headers,
      ...options,
    });
  };

  /**
   * Send POST request.
   *
   * @param {String} uri
   * @param {Object} data
   * @param {Object} options
   * @returns {Promise}
   */
  post(uri, data, options = {}) {
    return this._client.post(uri, data, {
      headers: this._headers,
      ...options,
    });
  };

  /**
   * Send PATCH request.
   *
   * @param {String} uri
   * @param {Object} data
   * @param {Object} options
   * @returns {Promise}
   */
  patch(uri, data, options = {}) {
    return this._client.patch(uri, data, {
      headers: this._headers,
      ...options,
    });
  };

  /**
   * Send PUT request.
   *
   * @param {String} uri
   * @param {Object} data
   * @param {Object} options
   * @returns {Promise}
   */
  put(uri, data, options = {}) {
    return this._client.put(uri, data, {
      headers: this._headers,
      ...options,
    });
  };

  /**
   * Send DELETE request.
   *
   * @param {String} uri
   * @param {Object} options
   * @returns {Promise}
   */
  delete(uri, options = {}) {
    return this._client.delete(uri, {
      headers: this._headers,
      ...options,
    });
  };

  /**
   * Add extra headers for each request.
   *
   * @param {Object} headers
   */
  setHeaders(headers) {
    this._headers = headers;
  };
}

module.exports = Client;
