// Removing query parameters specific to prerendering
// so that cached values can be shared

const omitParameters = [
  '__nojs',
  '__refresh',
]

module.exports = {
  init: () =>console.log('using rewrite url plugin'),

  requestReceived: (req, res, next) => {
    console.log('initial url:', req.prerender.url)
    req.prerender.url = rewriteUrl(req.prerender.url)
    console.log('final url  :', req.prerender.url)
    next()
  }
}

const rewriteUrl = url => {
  const [ path, queryString ] = Array.from(url.split('?'))

  if (!queryString || queryString.length === 0) return path

  query = new URLSearchParams(queryString)
  for (const parameter of omitParameters) {
    query.delete(parameter)
  }

  const updatedQueryString = query.toString()

  if (updatedQueryString.length === 0) return path
  else return `${path}?${updatedQueryString}`
}
