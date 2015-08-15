qs = require 'querystring'
_ = require 'lodash'

# a plugin to redirect bots queries on canical urls or existing functionalities
# -> increasing the chances of cache hit
# -> decreasing the need to customize the app client per-third party

module.exports =
  init: -> console.log 'using rewrite url plugin'

  beforePhantomRequest: (req, res, next) ->
    req.prerender.url = rewriteQuery req.prerender.url
    next()


rewriteQuery = (url)->
  [path, queryString] = url.split '?'

  query = qs.decode queryString
  { fb_locale } = query
  if fb_locale
    console.log 'initial query', query
    query.lang = shortLang(fb_locale)
    query = _.omit query, 'fb_locale'
    console.log 'new query', query
    queryString = qs.stringify query

  return "#{path}?#{queryString}"

shortLang = (lang)-> lang[0..1]
