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
````
const { Server } from require('ws-server-client');

const server = new Server({ port: 8000 });
server.start();
````

**NOTE:** The default port is 21001 if not specified in the configuration object. See below for a full list of configuration values.

More documentation to follow soon.
