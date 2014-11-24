/*

server.js

The MIT License (MIT)

Copyright (c) 2014 Tristan Slominski

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

*/

"use strict";

var events = require('events');
var fs = require('fs');
var https = require('https');
var path = require('path');
var url = require('url');
var util = require('util');

var CONFIG_PROPERTIES = ['host', 'port', 'pfx', 'key', 'passphrase', 'cert',
    'ca', 'crl', 'ciphers', 'handshakeTimeout', 'honorCipherOrder',
    'requestCert', 'rejectUnauthorized', 'NPNProtocols', 'SNICallback',
    'sessionIdContext', 'secureProtocol', 'secureOptions'];

var Server = module.exports = function Server(config) {
    var self = this;
    events.EventEmitter.call(self);

    config = config || {};
    CONFIG_PROPERTIES.forEach(function (property) {
        if (typeof config[property] !== 'undefined') {
            self[property] = config[property];
        }
    });

    self.host = self.host || 'localhost';
    self.port = self.port || 4443;

    self.server = null;
};


util.inherits(Server, events.EventEmitter);

Server.listen = function listen(config, callback) {
    var server = new Server(config);
    server.listen(callback);
    return server;
};

Server.prototype.close = function close(callback) {
    var self = this;
    if (self.server) {
        self.server.close(callback);
    }
};

Server.prototype.listen = function listen(callback) {
    var self = this;

    self.server = https.createServer(self);
    self.server.on('request', function (req, res) {
        var parsedUrl = url.parse(req.url, true);

        if (req.method === 'POST') {
            if (!req.headers.authorization) {
                res.writeHead(401);
                res.end();
                return;
            }

            var match = req.headers.authorization.match(/^Bearer (.+)$/);
            if (!match) {
                res.writeHead(401);
                res.end();
                return;
            }

            self.emit('request', match[1], req, res);

            return;
        }

        if (req.method !== 'GET') {
            res.writeHead(400);
            res.end();
            return;
        }

        // serve /browser.js
        if (parsedUrl.pathname.match(/^\/browser.js$/)) {
            res.writeHead(200, {'Content-Type': 'text/javascript'});
            fs.createReadStream(
                path.normalize(path.join(__dirname, 'public', 'browser.js')))
                .pipe(res);

            return;
        }

        // serve stem
        res.writeHead(200, {'Content-Type': 'text/html'});
        fs.createReadStream(
            path.normalize(path.join(__dirname, 'public', 'index.html')))
            .pipe(res);
    });
    self.server.on('listening', function () {
        self.emit('listening');
        if (callback) callback();
    });
    self.server.on('error', function (error) {
        self.emit('error', error);
    });
    self.server.listen(self.port, self.host);
};
