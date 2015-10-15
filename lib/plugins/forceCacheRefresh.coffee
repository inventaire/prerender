# a plugin to allow per-url fine-tuning of cache ttl
defaultTtl = 30*24*3600*1000
everyDay = 24*3600*1000
customTtls =
  '': everyDay

module.exports =
  init: -> console.log 'using force cache refresh plugin'

  beforePhantomRequest: (req, res, next) ->
    querystring = req.prerender.url.split('?')[1]
    if /__refresh=true/.test querystring
      req.refresh = true

    next()
