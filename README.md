# WebSocket Server & Client
This is still a work in progress and very much in the early stages of development.

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

You must implement the `process()` method for handling the event and sending messages to clients. This method must return a response instance. \
You must implement the `channel()` method to specify which channel the client must be subscribed to when sending the event.
```js
const { Event } = require('ws-server-client');

class ExampleEvent extends Event {
  process() {
    return this.response.toClient({ example: 'This is an example test.' });
  };

  channel() {
    return 'ExampleChannel';
  };
};

module.exports = ExampleEvent;
```

Sending payload to all clients connected except the one sending the event
```js
this.response.toOthers({...})
```

Sending payload to all clients connected
```js
this.response.toAll({...})
```

The message methods can also be chained together for ease-of-use when sending multiple messages on one event request
```js
this.response.toClient({...})
  .toOthers({...})
```

The storage instance can be used to set and get values through your selected storage driver (Only redis is currently supported)
```js
this.storage.set('example-key', 'example-value').then(...).catch(...);
```
```js
this.storage.get('example-key').then((value) => ...).catch(...);
```

### Send to server
All events **must** be sent in the following JSON structure

**Type:** String, required, equals `event` \
**Name:** String, required, camelCase \
**Data:** Object, optional

```json
{
  "type": "event",
  "name": "ExampleEvent",
  "data": {...}
}
```

## Channels
### Initial setup
Create your channel classes in an `channels` directory at the root of your project and the server will automatically import these to prevent you having to do it manually.
```js
const { Channel } = require('ws-server-client');

class ExampleChannel extends Channel {};

module.exports = ExampleChannel;
```

### Subscribe
All channel subscriptions **must** be sent in the following JSON structure

**Type:** String, required, equals `channel` \
**Name:** String, required, camelCase \
**Data:** Object

```json
{
  "type": "channel",
  "name": "ExampleChannel",
  "data": {
    "mode": "subscribe",
    ...
  }
}
```

### Unsubscribe
All channel unsubscriptions **must** be sent in the following JSON structure

**Type:** String, required, equals `channel` \
**Name:** String, required, camelCase \
**Data:** Object

```json
{
  "type": "channel",
  "name": "ExampleChannel",
  "data": {
    "mode": "unsubscribe",
    ...
  }
}
```

## JSON Responses
### Success
All successful events will send the following payload structure back to the client.
```json
{
  "status": "ok",
  "data": {...}
}
```

### Error
All failed events will send the following payload structure back to the client.
```json
{
  "status": "error",
  "data": {...},
  "errorType": "error-description"
}
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
