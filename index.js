const WebSocketServer = {};

WebSocketServer.Response = require('./lib/response');
WebSocketServer.Event = require('./lib/events/event');
WebSocketServer.Channel = require('./lib/channels/channel');

module.exports = WebSocketServer;
