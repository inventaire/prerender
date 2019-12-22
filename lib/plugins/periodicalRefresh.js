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
      console.log('forced refresh')
      req.refresh = true
    } else {
      req.refresh = getUrlRefresh(prerender.url)
    }
    next()
  }
}

const getUrlRefresh = url => {
  const section = url.split(/https?:\/\/[\w.:]+\//)[1]
  console.log('section: ', `/${section}`)
  const periodicity = refreshPeriodicity[section]
  const now = Date.now()
  if (periodicity != null) {
    console.log('section refresh periodicity: ', periodicity)
    lastRefresh[section] = lastRefresh[section] || now
    if (now - lastRefresh[section] > periodicity) {
      console.log('refreshing', url)
      lastRefresh[section] = now
      return true
    }
  }
  return false
}
