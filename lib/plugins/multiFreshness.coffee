# a plugin to allow per-url fine-tuning of cache freshness
defaultFreshness = 30*24*3600*1000
everyDay = 24*3600*1000
customFreshness =
  # refresh the home every day
  '': everyDay

module.exports =
  init: -> console.log 'using freshness plugin'

  beforePhantomRequest: (req, res, next) ->
    { refresh, prerender } = req
    if refresh
      console.log 'forced refresh'
      req.freshness = 0
    else
      req.freshness = getUrlSpecificFreshness prerender.url
    next()

getUrlSpecificFreshness = (url)->
  section = url.split(/https?:\/\/[\w.:]+\//)[1]
  console.log 'section: ', section
  custom = customFreshness[section]
  if custom?
    console.log 'custom freshness: ', custom
    return custom
  else defaultFreshness
