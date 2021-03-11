const Client = require('../axios/client');
const Config = require('../config/config');
const AuthUser = require('../auth/auth-user');
const dotProp = require('dot-prop');

class AuthManager {
  /**
   * Initialise new instance.
   *
   * @param {Config} config
   */
  constructor(config) {
    this.config = config;

    /**
     * The authenticated user.
     *
     * @type {AuthUser}
     * @private
     */
    this._user = new AuthUser();

    /**
     * The HTTP client used for authentication.
     *
     * @type {Client}
     * @private
     */
    this._http = new Client();
  };

  /**
   * Get authenticated user instance.
   *
   * @returns {AuthUser}
   */
  getAuthUser() {
    return this._user;
  };

  /**
   * Refresh user from HTTP endpoint.
   *
   * @param {String} token
   * @param {Function} callback
   */
  fetchUserByToken(token, callback) {
    this._http.get(this.config.get('auth.endpoints.user.url'), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(({ data }) => {
      this._user.setToken(token);
      this._user.setUser(dotProp.get(data, this.config.get('auth.endpoints.user.property')));

      callback();
    }).catch(err => {
      if (!err.response || err.response.status !== 401) {
        throw new Error(err);
      }

      callback();
    });
  };
};

module.exports = AuthManager;
