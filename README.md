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
```js
const { Server } = require('ws-server-client');

const server = new Server({ port: 21001 });
server.start();
```

**NOTE:** All available configuration properties below outlining their type and default value.

## Examples
### Creating an event
All event classes must implement the `process()` method which requires an instance of the `Response` class to be returned.

Creating your event classes in an `events` directory at the root of your project will mean the server can automatically import these to prevent you having to spend time doing this manually.
```js
const { Event, Response } = require('ws-server-client');

class ExampleEvent extends Event {
  process() {
    return (new Response({
      example: 'This is an example test.',
    })).toClient();
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

### Sending an event
All events **must** be sent in the following JSON structure

**Event:** String, required \
**Data:** Object, optional

```json
{
  "event": "ExampleEvent",
  "data": {...}
}
```

### Successful response
All successful events will send the following payload structure back to the client.
```json
{
  "status": "ok",
  "data": {...}
}
```

### Error response
All failed events will send the following payload structure back to the client.
```json
{
  "status": "error",
  "data": {...},
  "errorType": "error-description"
}
```

## Configuration
Name | Type | Default | Description
:---: | :---: | :---: | :---:
port | Number | 6000 | The port which the server listens to connections from.
events | Object | {} | The events the server should handle. If none specified, it will automatically look for events in your `/events` directory

## License
[MIT](LICENSE)
