# a plugin to allow per-url fine-tuning of cache ttl
defaultTtl = 30*24*3600*1000
everyDay = 24*3600*1000


customTtls =
  # refresh the home every day
  '': everyDay

module.exports =
  init: -> console.log 'using ttl plugin'

  beforePhantomRequest: (req, res, next) ->
    { refresh, prerender } = req
    if refresh
      console.log 'forced refresh'
      req.ttl = 0
    else
      req.ttl = getUrlSpecificTtl prerender.url
    next()

getUrlSpecificTtl = (url)->
  section = url.split(/https?:\/\/[\w.:]+\//)[1]
  console.log 'section: ', section
  custom = customTtls[section]
  if custom?
    console.log 'custom ttl: ', custom
    return custom
  else defaultTtl
