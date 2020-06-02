// A plugin to allow per-url fine-tuning of cache freshness
const defaultFreshness = 30*24*3600*1000
const everyDay = 24*3600*1000
const refreshPeriodicity = {
  // Refresh the home every day
  '': everyDay
}
const lastRefresh = {}

module.exports = {
  init: () => console.log('using freshness plugin'),

  requestReceived: (req, res, next) => {
    const { refresh, prerender } = req
    if (refresh) {
      console.log('forced refresh', prerender.url)
      req.refresh = true
    } else {
      req.refresh = getUrlRefresh(prerender.url)
    }
    next()
  }
}

const getUrlRefresh = url => {
  const section = url.split(/https?:\/\/[\w.:]+\//)[1]
  const periodicity = refreshPeriodicity[section]
  const now = Date.now()
  if (periodicity != null) {
    lastRefresh[section] = lastRefresh[section] || now
    if (now - lastRefresh[section] > periodicity) {
      console.log('periodical refresh', url)
      lastRefresh[section] = now
      return true
    }
  }
  return false
}
