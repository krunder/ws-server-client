# WebSocket Server & Client
This is still a work in progress and very much in the early stages of development. Features & code are subject to change as I continue to build my knowledge in this area.

## Installation
````
yarn add ws-server-client
````
or
````
npm install ws-server-client
````

## Getting Started
Add the following to your package.json
```json
"scripts": {
  "start": "node ./node_modules/ws-server-client/start.js"
},
```

Create a .env file in the root directory of your project
```text
APP_PORT=21000
APP_ENV=local
APP_HOST=127.0.0.1
APP_SCHEME=http
APP_KEY=changeme

CORS_HEADERS=
CORS_ORIGIN=
CORS_METHODS=
CORS_CREDENTIALS=

STORAGE_DRIVER=redis
SESSION_DRIVER=memory

REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_UNIX_PATH=
```

## Configuration
Here are a full list of all supported configuration options.

Name | .env Name | Type | Default | Description
:---: | :---: | :---: | :---: | :---:
app.env | APP_ENV | Number | local | The environment the application is currently running on.
app.port | APP_PORT | Number | 21000 | The port which the server listens to connections on.
app.key | APP_KEY | String | changeme | The key used for sessions and other forms of encryption.
app.host | APP_HOST | String | 127.0.0.1 | The host which the server listens to connections on.
app.scheme | APP_SCHEME | String | http | The scheme/protocol which the server listens to connections on.
client.url | CLIENT_URL | String | http://localhost | The base URL of the client where the connection is made from.
api.url | API_URL | String | http://localhost | The base URL for the API endpoints.
auth.endpoints.user.url | | String | null | The endpoint to retrieve the authenticated user.
auth.endpoints.user.property | | String | data | The property to pull the user data from the response.
cors.headers | CORS_HEADERS | String | * | The cross-site headers allowed.
cors.origin | CORS_ORIGIN | String | * | The cross-site origin allowed.
cors.methods | CORS_METHODS | String | * | The cross-site methods allowed.
cors.credentials | CORS_CREDENTIALS | Boolean | true | The cross-site credentials allowed.
storage.driver | STORAGE_DRIVER | String | redis | The driver to determine the type of storage system. Supported values: redis
storage.prefix | | String | <app.env>_ | The prefix applied on all storage values.
session.driver | SESSION_DRIVER | String | memory | The driver to determine the type of session system. Supported values: memory, redis
session.expiry | | String | 60 | The expiry time for each session in minutes.
redis.host | REDIS_HOST | String | 127.0.0.1 | The host for establishing the redis connection.
redis.port | REDIS_PORT | Number | 6379 | The port for establishing the redis connection.
redis.password | REDIS_PASSWORD | String | null | The password for authentication when establishing the redis connection.
redis.unix_path | REDIS_UNIX_PATH | String | null | The unix socket path for establishing the redis connection.

## Events
### Initial setup
Create your event classes in an `events` directory at the root of your project and the server will automatically import these.
* The `listen(socket, payload)` method **MUST** be implemented to handle the event and return data back. This method can return a number, object, array or string. \
* The `authorize(socket, payload)` method can be implemented to determine where the socket is authorized. Defaults to true if not specified. This method must return a boolean.
* The `namespace()` method can be implemented to specify which namespace to restrict the event to. This method must return a string.

```js
const { Event } = require('ws-server-client');

class ExampleEvent extends Event {
  authorize(socket, payload) {
    return true;
  };

  listen(socket, payload) {
    return { example: 'This is an example data response.' };
  };

  namespace() {
    return 'ExampleNamespace';
  };
};

module.exports = ExampleEvent;
```

The storage instance can be used to set and get values through your selected storage driver (Only redis is currently supported)
```js
this.storage.set('example-key', 'example-value').then(...).catch(...);
```
```js
this.storage.get('example-key').then((value) => ...).catch(...);
```

The config instance can be used to get configuration values. The key specified uses dot-notation.
```js
this.storage.get('app.env');
```

### Send to server
All events will be sent to the server using the Socket IO client library.

```js
io.emit('ExampleEvent', { example: 'Example payload.'}, data => {});
```

## Namespaces
### Initial setup
Create your namespace classes in a `namespaces` directory at the root of your project and the server will automatically import these.
* The `authorize(socket, { query })` method can be implemented to determine whether the socket is authorized to connect. Defaults to true if not specified. This method must return a boolean.
* The `connect(socket, { query })` method can be implemented to handle a new socket connection. This method doesn't have to return anything.
* The `disconnect(socket)` method can be implemented to handle a socket being disconnected. This method doesn't have to return anything.

```js
const { Namespace } = require('ws-server-client');

class ExampleNamespace extends Namespace {
  authorize(socket, { query }) {
    return true;
  };

  connect(socket, { query }) {
    socket.emit('InitialData', { example: 'Example payload if you want to send the client initial data.' });
  };
 
  disconnect(socket) {};
};

module.exports = ExampleNamespace;
```

## License
[MIT](LICENSE)
