const WebSocketServer = {};

WebSocketServer.Server = require('./lib/server');
WebSocketServer.Response = require('./lib/response');
WebSocketServer.Event = require('./lib/events/event');

module.exports = WebSocketServer;
