/*

stem.js

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

var https = require('https');
var store = require('store');

module.exports = function stem(name, handler, window, document) {
    // first, check if the browser has the capability already stored
    var capability = store.get(name);

    // capability in the URI always takes precedence
    if (window.location.hash) {
        // slice(1) removes leading '#' in hash
        capability = window.location.hash.slice(1);
        store.set(name, capability);
    }

    var options = {
        headers: {
            'Authorization': 'Bearer ' + capability
        },
        hostname: window.location.hostname,
        port: window.location.port,
        path: window.location.pathname + window.location.search,
        method: 'POST'
    };

    var req = https.request(options);
    req.on('response', handler);
    req.end();
};
