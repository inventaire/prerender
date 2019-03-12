#!/usr/bin/env node
var prerender = require('./lib');

var server = prerender(require('config'));

server.use(prerender.sendPrerenderHeader());
// server.use(prerender.blockResources());
server.use(prerender.removeScriptTags());
server.use(prerender.httpHeaders());

// Reading refresh query string parameter before rewriteUrl overrides it
server.use(prerender.forceCacheRefresh());
// Rewrite url before checking cache to get as many cache hit as possible
server.use(prerender.rewriteUrl());
server.use(prerender.multiFreshness());

server.use(require('prerender-level-cache'));

server.start();
