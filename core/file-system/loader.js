const fs = require('graceful-fs');

class Loader {
  /**
   * Initialise the loader instance.
   *
   * @param {String} basePath
   */
  constructor(basePath = '') {
    /**
     * The base path to load files from.
     *
     * @type {String}
     */
    this.basePath = `/${basePath}`;

    /**
     * The files loaded from the directory.
     *
     * @type {Array}
     */
    this.files = [];
  };

  /**
   * Load files from directory.
   *
   * @param {String} path
   * @param {Function} callback
   * @param {Boolean} recursive
   */
  fromDir(path, callback, recursive = true) {
    fs.readdir(`${process.cwd()}${this.basePath}${path}`, { withFileTypes: true }, (err, listings) => {
      // Get file listings from this directory
      const files = listings.filter(file => file.isFile()).map(file => {
        const name = file.name.replace(/\.[^\/.]+$/, '');

        return {
          name,
          path: path || '/',
          fullPath: `${process.cwd()}${this.basePath}${path}/${name}`,
        };
      });
      this.files = [...this.files, ...files];

      // Get file listings from all sub-directories
      const directories = listings.filter(file => file.isDirectory());
      directories.forEach(dir => this.fromDir(`${path}/${dir.name}`, callback));

      // Run callback with list of files if no more sub-directories
      if (directories.length === 0) {
        callback(this.files);
      }
    });
  };
};

module.exports = Loader;
