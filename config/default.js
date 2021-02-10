module.exports = {
  chromeLocation: '/usr/bin/chromium-browser',
  logBrowserConsole: false,
  logRequests: false,
  ttl: 24 * 60 * 60 * 1000,
  omittedHeaders: [
    'set-cookie',
    'authorization',
  ]
}
