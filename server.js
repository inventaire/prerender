#!/usr/bin/env node
var prerender = require('./lib');

var server = prerender(require('config'));

server.use(prerender.sendPrerenderHeader());
// server.use(prerender.blockResources());
server.use(prerender.removeScriptTags());
server.use(prerender.httpHeaders());

// Reading refresh query string parameter before rewriteUrl overrides it
server.use(prerender.forceCacheRefresh());
server.use(prerender.periodicalRefresh());
server.use(prerender.removeNoscriptReload());

server.use(require('prerender-level-cache'));

server.start();
