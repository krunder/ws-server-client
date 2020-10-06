class Auth {
  /**
   * Initialise new auth instance.
   */
  constructor() {
    /**
     * The authenticated user.
     *
     * @type {String|null}
     * @private
     */
    this._user = null;

    /**
     * The authentication token.
     *
     * @type {String|null}
     * @private
     */
    this._token = null;
  };

  /**
   * Set authenticated user.
   *
   * @param {Object} user
   */
  setUser(user) {
    this._user = user;
  };

  /**
   * Set authentication token.
   *
   * @param {String} token
   */
  setToken(token) {
    this._token = token;
  };

  /**
   * Get authenticated user.
   *
   * @returns {Object}
   */
  getUser() {
    return this._user;
  };

  /**
   * Get authentication token.
   *
   * @returns {String}
   */
  getToken() {
    return this._token;
  };

  /**
   * Check whether authenticated.
   *
   * @returns {Boolean}
   */
  isAuthenticated() {
    return !!this._user;
  };
};

module.exports = Auth;
