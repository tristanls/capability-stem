# capability-stem

_Stability: 1 - [Experimental](https://github.com/tristanls/stability-index#stability-1---experimental)_

[![NPM version](https://badge.fury.io/js/capability-stem.png)](http://npmjs.org/package/capability-stem)

Capability stem enabling capabilities in GET HTTPS requests.

The capability is initially encoded as the fragment in the URI (see: https://tools.ietf.org/html/rfc3986#section-3.5). When the server receives the GET request, it returns JavaScript to the client that reads the fragment from the URI and encodes it as a Bearer token in a POST request (see: https://tools.ietf.org/html/rfc6750).

## Contents

  * [Installation](#installation)
  * [Usage](#usage)
  * [Tests](#tests)
  * [Documentation](#documentation)
    * [CapabilityStem](#capabilitystem)

## Installation

    npm install capability-stem

## Usage

To run the below example run:

    npm run readme

```javascript
"use strict";

var crypto = require('crypto');
var fs = require('fs');
var path = require('path');
var StemServer = require('../server.js');

var EXAMPLE_CAPABILITY = crypto.randomBytes(42).toString('base64');

var stemServer = StemServer.listen({
    host: 'localhost',
    port: 4443,
    key: fs.readFileSync(path.normalize(path.join(__dirname, 'readme/server-key.pem'))),
    cert: fs.readFileSync(path.normalize(path.join(__dirname, 'readme/server-cert.pem'))),
    secureProtocol: "TLSv1_method"
});

stemServer.on('listening', function () {
    console.log('server listening on https://localhost:4443');
    console.log('   ...try visiting https://localhost:4443/#' + EXAMPLE_CAPABILITY);
    console.log('');
    console.log('Ctrl+C to exit');
});

stemServer.on('request', function (capability, req, res) {
    // we have a capability string, a request, and a response object

    // for example, we only allow EXAMPLE_CAPABILITY
    if (capability !== EXAMPLE_CAPABILITY) {
        console.log('received invalid request...');
        res.writeHead(401, {'Content-Type': 'text/html'});
        res.write('<h2>401 Unauthorized</h2>');
        res.end();
        return;
    }

    console.log('received valid request...');
    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.createReadStream(
        path.normalize(path.join(__dirname, 'readme', 'content.html')))
        .pipe(res);
});

```

## Tests

None at this time.

## Documentation

  * [CapabilityStem](#capabilitystem)

### CapabilityStem

**Public API**

  * [CapabilityStem.listen(config, \[callback\])](#capabilitystemlistenconfig-callback)
  * [new CapabilityStem(config)](#new-capabilitystemconfig)
  * [capabilityStem.close(\[callback\])](#capabilitystemclosecallback)
  * [capabilityStem.listen(\[callback\])](#capabilitystemlistencallback)
  * [Event 'request'](#event-request)

### CapabilityStem.listen(config, [callback])

  * `config`: See [new CapabilityStem(config)](#new-capabilitystemconfig).
  * `callback`: See [capabilityStem.listen(\[callback\])](#capabilitystemlistencallback).
  * Return: _Object_ An instance of CapabilityStem with server listening for connections.

Creates a new CapabilityStem instance and starts listening for connections.

### new CapabilityStem(config)

  * `config`: _Object_
    * `host`: _String_ _(Default: `localhost`)_.
    * `port`: _Integer_ _(Default: 4443)_ A port value of zero will assign a random port.
    * `pfx`: See [tls.createServer() options](http://nodejs.org/api/tls.html#tls_tls_createserver_options_secureconnectionlistener).
    * `key`: See [tls.createServer() options](http://nodejs.org/api/tls.html#tls_tls_createserver_options_secureconnectionlistener).
    * `passphrase`: See [tls.createServer() options](http://nodejs.org/api/tls.html#tls_tls_createserver_options_secureconnectionlistener).
    * `cert`: See [tls.createServer() options](http://nodejs.org/api/tls.html#tls_tls_createserver_options_secureconnectionlistener).
    * `ca`: See [tls.createServer() options](http://nodejs.org/api/tls.html#tls_tls_createserver_options_secureconnectionlistener).
    * `crl`: See [tls.createServer() options](http://nodejs.org/api/tls.html#tls_tls_createserver_options_secureconnectionlistener).
    * `ciphers`: See [tls.createServer() options](http://nodejs.org/api/tls.html#tls_tls_createserver_options_secureconnectionlistener).
    * `handshakeTimeout`: See [tls.createServer() options](http://nodejs.org/api/tls.html#tls_tls_createserver_options_secureconnectionlistener).
    * `honorCipherOrder`: See [tls.createServer() options](http://nodejs.org/api/tls.html#tls_tls_createserver_options_secureconnectionlistener).
    * `requestCert`: See [tls.createServer() options](http://nodejs.org/api/tls.html#tls_tls_createserver_options_secureconnectionlistener).
    * `rejectUnauthorized`: See [tls.createServer() options](http://nodejs.org/api/tls.html#tls_tls_createserver_options_secureconnectionlistener).
    * `NPNProtocols`: See [tls.createServer() options](http://nodejs.org/api/tls.html#tls_tls_createserver_options_secureconnectionlistener).
    * `SNICallback`: See [tls.createServer() options](http://nodejs.org/api/tls.html#tls_tls_createserver_options_secureconnectionlistener).
    * `sessionIdContext`: See [tls.createServer() options](http://nodejs.org/api/tls.html#tls_tls_createserver_options_secureconnectionlistener).
    * `secureProtocol`: See [tls.createServer() options](http://nodejs.org/api/tls.html#tls_tls_createserver_options_secureconnectionlistener).
    * `secureOptions`: See [tls.createServer() options](http://nodejs.org/api/tls.html#tls_tls_createserver_options_secureconnectionlistener).

Creates a new CapabilityStem instance.

### capabilityStem.close([callback])

  * `callback`: _Function_ _(Default: undefined)_ `function () {}` Optional callback to call once the server is stopped.

Stops the CapabilityStem server from accepting new connections.

### capabilityStem.listen([callback])

  * `callback`: _Function_ _(Default: undefined)_ `function () {}` Optional callback to call once the server is listening for connections.

After `listen()` is called, the server will begin accepting new connections.

### Event 'request'

  * `function (capability, request, response) {}`
    * `capability`: _String_ The capability string associated with the request.
    * `request`: _Object_ An instance of [http.IncomingMessage](http://nodejs.org/api/http.html#http_http_incomingmessage).
    * `response`: _Object_ An instance of [http.ServerResponse](http://nodejs.org/api/http.html#http_class_http_serverresponse).

Emitted when the server receives a request with correctly encoded `capability`.

**WARNING** You still need to check that the `capability` is valid.
