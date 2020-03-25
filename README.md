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

## Events
### Initial setup
All event classes must implement the `process()` method which requires an instance of the `Response` class to be returned.

Creating your event classes in an `events` directory at the root of your project will mean the server can automatically import these to prevent you having to do this manually.
```js
const { Event, Response } = require('ws-server-client');

class ExampleEvent extends Event {
  process() {
    return (new Response({
      example: 'This is an example test.',
    })).toClient();
  };

  channel() {
    return 'ExampleChannel';
  };
};

module.exports = ExampleEvent;
```

Sending payload to all clients connected except the one sending the event
```js
return (new Response({...})).toOthers()
```

Sending payload to all clients connected
```js
return (new Response({...})).toAll()
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
Creating your channel classes in a `channels` directory at the root of your project will mean the server can automatically import these to prevent you having to do this manually.

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
Create this configuration file `config/server.js` within your project using the following structure to override any of the values.
```js
module.exports = {
  port: 7000,
};
```

Here are a full list of all supported configuration options.

Name | Type | Default | Description
:---: | :---: | :---: | :---:
port | Number | 21000 | The port which the server listens to connections from.

## License
[MIT](LICENSE)
