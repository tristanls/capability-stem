/*

readme.js

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
    console.log(req.url);
    console.dir(req.headers);
    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.createReadStream(
        path.normalize(path.join(__dirname, 'readme', 'content.html')))
        .pipe(res);
});
