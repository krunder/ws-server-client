const Config = require('./core/config/config');
const Storage = require('./core/storage/storage');
const Server = require('./core/server');

// Get config and storage
const config = new Config();
const storage = new Storage(config);

// Initialise server
const server = new Server(config);
server.setStorage(storage);
server.init(() => server.start());

