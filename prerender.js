#!/usr/bin/env node
var prerender = require('./lib');

var server = prerender({
    workers: process.env.PRERENDER_NUM_WORKERS,
    iterations: process.env.PRERENDER_NUM_ITERATIONS,
    // Set PhantomJS to cache resources (JS, CSS, etc)
    // cf https://github.com/prerender/prerender/issues/247
    phantomArguments: {
      // Default flags
      '--load-images': false,
      '--ignore-ssl-errors': true,
      '--ssl-protocol': 'tlsv1.2',
      // Customized
      '--disk-cache': true
    }
});


server.use(prerender.sendPrerenderHeader());
// server.use(prerender.basicAuth());
// server.use(prerender.whitelist());
server.use(prerender.blacklist());
// server.use(prerender.logger());
server.use(prerender.removeScriptTags());
server.use(prerender.httpHeaders());
// server.use(prerender.inMemoryHtmlCache());
// server.use(prerender.s3HtmlCache());

var invPlugins = require('inv-prerender-plugins')

// reading refresh query string parameter
// before rewriteUrl overrides it
server.use(invPlugins.forceCacheRefresh);
// rewrite url before checking cache
// to get as many cache hit as possible
server.use(invPlugins.rewriteUrl);
server.use(invPlugins.multiFreshness);

server.use(require('prerender-level-cache'));

server.start();
