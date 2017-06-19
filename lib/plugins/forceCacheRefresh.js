// a plugin to allow per-url fine-tuning of cache freshness

module.exports = {
  init: () => console.log('using force cache refresh plugin'),

  beforePhantomRequest: (req, res, next) => {
    const querystring = req.prerender.url.split('?')[1]
    if (/__refresh=true/.test(querystring)) {
      req.refresh = true
    }

    next()
  }
}
