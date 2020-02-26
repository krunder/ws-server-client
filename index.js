const WebSocketServer = {};

WebSocketServer.Server = require('./lib/server');
WebSocketServer.Response = require('./lib/response');
WebSocketServer.Event = require('./lib/event');

module.exports = WebSocketServer;
