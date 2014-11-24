/*

browser.js

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

var concat = require('concat-stream');
var https = require('https');

function stem(window, document) {
    var options = {
        headers: {
            // hash starts with '#'
            'Authorization': 'Bearer ' + window.location.hash.slice(1)
        },
        hostname: window.location.hostname,
        port: window.location.port,
        path: '/',
        method: 'POST'
    };

    var req = https.request(options);
    req.on('response', function (res) {
        var html = concat(function (data) {
            document.body.innerHTML = data;
        });
        res.pipe(html);
    });

    req.write(window.location.search);
    req.end();
};

stem(window, document);