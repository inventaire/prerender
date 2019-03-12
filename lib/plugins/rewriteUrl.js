// A plugin to redirect bots queries
// - rewritting urls to keep only the canonical form
// - limiting and rewritting query parameters to just what is needed to render the right content
// => increasing the chances of cache hit
// => decreasing the need to customize the app client per-third party

const qs = require('querystring')
const { pick } = require('lodash')
const whitelistParameters = [ 'lang', 'q' ]

module.exports = {
  init: () =>console.log('using rewrite url plugin'),

  requestReceived: (req, res, next) => {
    req.prerender.url = rewriteUrl(req.prerender.url)
    next()
  }
}


const rewriteUrl = url => {
  console.log('initial url:', url)
  var [ path, queryString ] = Array.from(url.split('?'))

  path = useCanonicalUrls(path)

  var query = qs.decode(queryString)
  query = redirectFbLocale(query)

  // just keeping whitelisted parameters
  const cleanedQuery = pick(query, whitelistParameters)
  const cleanedQueryLength = Object.keys(cleanedQuery).length
  if (cleanedQueryLength > 0) {
    queryString = qs.stringify(cleanedQuery)
    url = `${path}?${queryString}`
  } else {
    url = path
  }

  // adding spacing in the log to make comparision with intial url easier
  console.log('final url  :', url)
  return url
}


const redirectFbLocale = query => {
  const { fb_locale } = query
  // override the lang parameter
  if (fb_locale) query.lang = shortLang(fb_locale)
  return query
}

const shortLang = lang => lang.slice(0, 2)

const useCanonicalUrls = path => {
  return path
  // just keep 'https:///entity/wd:Q7799037'
  // in 'https:///entity/wd:Q7799037/blablabla_title'
  .replace(/(\/entity\/[\w]{2,4}:\w{1,32})\/.*/, '$1')
  // just keep 'https:///inventory/username/wd:Q7799037'
  // in 'https:///inventory/username/wd:Q7799037/blablabla_title'
  .replace(/(\/inventory\/\w{1,20}\/[\w]{2,4}:\w{1,32})\/.*/, '$1')
}
