// a plugin to allow per-url fine-tuning of cache freshness
const defaultFreshness = 30 * 24 * 3600 * 1000
const everyDay = 24 * 3600 * 1000
const customFreshness = {
  // refresh the home every day
  '': everyDay
}

module.exports = {
  init: () => console.log('using freshness plugin'),
  beforePhantomRequest: (req, res, next) => {
    const { refresh, prerender } = req
    if (refresh) {
      console.log('forced refresh')
      req.freshness = 0
    } else {
      req.freshness = getUrlSpecificFreshness(prerender.url)
    }
    next()
  }
}

const getUrlSpecificFreshness = (url) => {
  const section = url.split(/https?:\/\/[\w.:]+\//)[1]
  console.log('section: ', section)
  const custom = customFreshness[section]
  if (custom != null) {
    console.log('custom freshness: ', custom)
    return custom
  } else {
    return defaultFreshness
  }
}
