const Config = require('./core/config/config');
const Storage = require('./core/storage/storage');
const Client = require('./core/axios/client');
const Server = require('./core/server');

// Initialise new instances
const config = new Config();
const storage = new Storage(config);
const server = new Server(config);
const http = new Client(config);

// Initialize application
let app;

try {
  app = new (require(`${process.cwd()}/app`))(config);
} catch (err) {
  if (!err.code || err.code !== 'MODULE_NOT_FOUND') {
    throw err;
  }

  app = new (require('./lib/app'))(config);
}

app.setServer(server);
app.setStorage(storage);
app.setHttp(http);

server.setApp(app);
server.setStorage(storage);
server.setHttp(http);

// Initialize application
app.init(() => {
  // Initialize server
  server.init(() => server.start());
});


