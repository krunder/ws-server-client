const fs = require('graceful-fs');

class Loader {
  constructor() {
    /**
     * The files loaded from the directory.
     *
     * @type {Array}
     */
    this.files = [];

    /**
     * The directory path to search for files against.
     *
     * @type {String}
     */
    this.path = `${process.cwd()}/events`;
  };

  /**
   * Load all event classes.
   */
  load() {
    return this.loadFromDirectory(this.path);
  };

  loadFromDirectory(path) {
    fs.readdir(path, { withFileTypes: true }, (err, listings) => {
      const files = listings.filter(file => file.isFile()).map(file => {
        return file.name.replace(/\.[^\/.]+$/, '');
      });
      this.files = [...this.files, ...files];

      // Get file listings from all sub-directories
      const directories = listings.filter(file => file.isDirectory());
      directories.forEach(dir => this.loadFromDirectory(`${path}/${dir.name}`));

      // If there are no more sub-directories, return new successful promise with list of files
      if (directories.length === 0) {
        return Promise.resolve(this.files);
      }
    });
  };
};

module.exports = Loader;
