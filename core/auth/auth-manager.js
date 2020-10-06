const Client = require('../axios/client');
const dotProp = require('dot-prop');

class AuthManager {
  /**
   * Initialise the auth manager instance.
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
  };

  /**
   * Refresh user from HTTP endpoint.
   *
   * @param {String} token
   */
  async getUser(token) {
    const { data } = await this.http.get(this.config.auth.endpoints.user.url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return dotProp.get(data, this.config.auth.endpoints.user.property);
  };
};

module.exports = AuthManager;
