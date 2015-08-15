qs = require 'querystring'

# a plugin to redirect bots queries on canical urls or existing functionalities
# -> increasing the chances of cache hit
# -> decreasing the need to customize the app client per-third party

module.exports =
  init: -> console.log 'using rewrite url plugin'

  beforePhantomRequest: (req, res, next) ->
    req.prerender.url = rewriteUrl req.prerender.url
    next()


rewriteUrl = (url)->
  console.log 'initial url', url
  [path, queryString] = url.split '?'

  path = useCanonicalUrls path

  query = qs.decode queryString

  { fb_locale } = query
  if fb_locale
    # override the lang parameter
    query.lang = shortLang fb_locale

  # just keeping whitelisted parameters
  if query.lang?
    cleanedQuery = { lang: query.lang }
    queryString = qs.stringify cleanedQuery
    url = "#{path}?#{queryString}"
  else
    url = path

  console.log 'final url', url
  return url



shortLang = (lang)-> lang[0..1]

useCanonicalUrls = (path)->
  # just keep 'https:///entity/wd:Q7799037'
  # in 'https:///entity/wd:Q7799037/blablabla_title'
  path.replace /(\/entity\/[\w]{2,3}:\w{1,32})\/.*/, '$1'
  # just keep 'https:///inventory/username/wd:Q7799037'
  # in 'https:///inventory/username/wd:Q7799037/blablabla_title'
  path.replace /(\/inventory\/\w{1,20}\/[\w]{2,3}:\w{1,32})\/.*/, '$1'
