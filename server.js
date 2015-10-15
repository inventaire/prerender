#!/usr/bin/env node
var prerender = require('./lib');

var server = prerender({
    workers: process.env.PHANTOM_CLUSTER_NUM_WORKERS,
    iterations: process.env.PHANTOM_WORKER_ITERATIONS || 10,
    phantomBasePort: process.env.PHANTOM_CLUSTER_BASE_PORT || 12300,
    messageTimeout: process.env.PHANTOM_CLUSTER_MESSAGE_TIMEOUT
});


// server.use(prerender.basicAuth());
// server.use(prerender.whitelist());
server.use(prerender.blacklist());
// server.use(prerender.logger());
server.use(prerender.removeScriptTags());
server.use(prerender.httpHeaders());
// server.use(prerender.inMemoryHtmlCache());
// server.use(prerender.s3HtmlCache());

// reading refresh query string parameter
// before rewriteUrl overrides it
server.use(prerender.forceCacheRefresh());
// rewrite url before checking cache
// to get as many cache hit as possible
server.use(prerender.rewriteUrl());
server.use(prerender.multiTtl());

server.use(require('prerender-level-cache'));

server.start();
