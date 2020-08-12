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
  "start": "node ./node_modules/ws-server-client/server.js"
},
```

Create a .env file in the root directory of your project
```text
APP_PORT=21000
APP_ENV=local

STORAGE_DRIVER=redis

REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_UNIX_PATH=
```
**NOTE**: Currently redis is the only storage driver supported. Further support will be added in the future.

## Events
### Initial setup
Create your event classes in an `events` directory at the root of your project and the server will automatically import these to prevent you having to do it manually.

The `listen()` method **MUST** be implemented to handle the event and return data back. This method can return a number, object, array or string. \
The `namespace()` method can be implemented to specify which namespace to restrict the event to. This method must return a string.
```js
const { Event } = require('ws-server-client');

class ExampleEvent extends Event {
  listen() {
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

### Send to server
All events will be sent to the server using the Socket IO client library.

```js
io.emit('ExampleEvent', { example: 'Example payload.'}, data => {});
```

## Namespaces
### Initial setup
Create your namespace classes in an `namespaces` directory at the root of your project and the server will automatically import these to prevent you having to do it manually.

The `connect(socket)` method can be implemented to handle when a new socket gains connection. This method doesn't have to return anything.
```js
const { Namespace } = require('ws-server-client');

class ExampleNamespace extends Namespace {
  connect(socket) {
    socket.emit('InitialData', { example: 'Example payload if you want to send the client initial data.' });
  };
};

module.exports = ExampleNamespace;
```

## Configuration
Here are a full list of all supported configuration options.

Name | .env Name | Type | Default | Description
:---: | :---: | :---: | :---: | :---:
app.port | APP_PORT | Number | 21000 | The port which the server listens to connections from.
app.environment | APP_ENV | Number | local | The environment the application is currently running on.
auth.endpoints.user.url | | String | null | The endpoint to retrieve the authenticated user.
auth.endpoints.user.property | | String | data | The property to pull the user data from the response.
storage.driver | STORAGE_DRIVER | Number | redis | The driver to determine the type of storage system.
redis.host | REDIS_HOST | String | 127.0.0.1 | The host for establishing the redis connection.
redis.port | REDIS_PORT | Number | 6379 | The port for establishing the redis connection.
redis.password | REDIS_PASSWORD | String | null | The password for authentication when establishing the redis connection.
redis.unix_path | REDIS_UNIX_PATH | String | null | The unix socket path for establishing the redis connection.

## License
[MIT](LICENSE)
