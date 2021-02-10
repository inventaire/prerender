module.exports = {
  pageLoaded: (req, res, next) => {
    if (!req.prerender.content || req.prerender.renderType != 'html') {
      return next()
    }

    req.prerender.content = req.prerender.content
      .replace(/<noscript>\s*<meta http-equiv.{10,80}noscript>/, '')

    next()
  }
}
