const Client = require('../axios/client');
const dotProp = require('dot-prop');

class AuthManager {
  /**
   * Initialise the auth instance.
   *
   * @param {Object} config
   */
  constructor(config) {
    this.config = config;

    /**
     * The HTTP client used for authentication.
     *
     * @type {Client}
     */
    this.http = new Client();

    /**
     * The authentication bearer token.
     *
     * @type {String}
     * @private
     */
    this._token = '';

    /**
     * The authenticated user object.
     *
     * @type {Object}
     * @private
     */
    this._user = {};
  };

  /**
   * Refresh user from HTTP endpoint.
   */
  refreshUser() {
    this.http.get(this.config.auth.endpoints.user.url, {
      headers: {
        Authorization: `Bearer ${this._token}`,
      },
    }).then(({ data }) => {
      this._user = dotProp.get(data, this.config.auth.endpoints.user.property);
    }).catch(() => {
      // Don't do anything yet. To be implemented.
    });
  };

  /**
   * Get authenticated user instance.
   */
  getUser() {
    return this._user;
  };

  /**
   * Check whether an authenticated user instance exists.
   *
   * @returns {Boolean}
   */
  hasUser() {
    return !!this._user;
  };

  /**
   * Set authentication bearer token.
   *
   * @param {String} token
   */
  setToken(token) {
    this._token = token;
  };

  /**
   * Get authentication bearer token.
   *
   * @returns {String}
   */
  getToken() {
    return this._token;
  };
};

module.exports = AuthManager;
