const WebSocketServer = {};

WebSocketServer.Event = require('./lib/event');
WebSocketServer.Namespace = require('./lib/namespace');
WebSocketServer.Application = require('./lib/app');

module.exports = WebSocketServer;
