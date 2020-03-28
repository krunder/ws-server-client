const Driver = require('./driver');

class File extends Driver {
  init() {
    console.info('Initialising file driver...');
  };
};

module.exports = File;

