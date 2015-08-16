# a plugin to redirect bots queries
# - rewritting urls to keep only the canonical form
# - limiting and rewritting query parameters to just what is needed to render the right content
# => increasing the chances of cache hit
# => decreasing the need to customize the app client per-third party

qs = require 'querystring'
_ = require 'lodash'
whitelistParameters = [ 'lang', 'q' ]

module.exports =
  init: -> console.log 'using rewrite url plugin'

  beforePhantomRequest: (req, res, next) ->
    req.prerender.url = rewriteUrl req.prerender.url
    next()


rewriteUrl = (url)->
  console.log 'initial url:', url
  [path, queryString] = url.split '?'

  path = useCanonicalUrls path

  query = qs.decode queryString
  query = redirectFbLocale query

  console.log 'query', query
  # just keeping whitelisted parameters
  cleanedQuery = _.pick query, whitelistParameters
  cleanedQueryLength = Object.keys(cleanedQuery).length
  console.log 'cleanedQuery', cleanedQuery
  console.log 'cleanedQueryLength', cleanedQueryLength
  if cleanedQueryLength > 0
    queryString = qs.stringify cleanedQuery
    url = "#{path}?#{queryString}"
  else
    url = path

  # adding spacing in the log to make comparision with intial url easier
  console.log 'final url  :', url
  return url


redirectFbLocale = (query)->
  { fb_locale } = query
  if fb_locale
    # override the lang parameter
    query.lang = shortLang fb_locale

  return query

shortLang = (lang)-> lang[0..1]

useCanonicalUrls = (path)->
  # just keep 'https:///entity/wd:Q7799037'
  # in 'https:///entity/wd:Q7799037/blablabla_title'
  path.replace /(\/entity\/[\w]{2,3}:\w{1,32})\/.*/, '$1'
  # just keep 'https:///inventory/username/wd:Q7799037'
  # in 'https:///inventory/username/wd:Q7799037/blablabla_title'
  path.replace /(\/inventory\/\w{1,20}\/[\w]{2,3}:\w{1,32})\/.*/, '$1'
