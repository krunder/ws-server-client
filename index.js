const WebSocketServer = {};

WebSocketServer.Event = require('./lib/events/event');
WebSocketServer.Namespace = require('./lib/namespaces/namespace');
WebSocketServer.Server = require('./core/server');

module.exports = WebSocketServer;
