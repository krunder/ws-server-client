const Config = require('./core/config/config');
const Storage = require('./core/storage/storage');
const Server = require('./core/server');

// Initialise new instances
const config = new Config();
const storage = new Storage(config);
const server = new Server(config);

// Initialize application
try {
  const app = new (require(`${process.cwd}/app.js`))(config);
  app.setServer(server);
  app.setStorage(storage);
} catch (err) {
  if (!err.code || err.code !== 'MODULE_NOT_FOUND') {
    throw err;
  }
}

// Initialize server
server.setStorage(storage);
server.init(() => server.start());
