// This plugin anticipates the response from the client
// to save wasted prerender CPU/RAM and cache disk space
// The response can be different from what the client would actually return:
// Ex: https://inventaire.io/entity/wd:Q34660/edit will be redirected to https://inventaire.io/entity/wd:Q34660
// instead of returning a 401

const { URL } = require('url')

module.exports = {
  init: () => console.log('using anticipate redirect plugin'),

  requestReceived: (req, res, next) => {
    const { href, pathname, origin } = new URL(req.prerender.url)

    const [ part1, part2, part3 ] = pathname.slice(1).split('/')
    let redirection

    if (loggedInSections.has(part1)) {
      redirection = `${origin}/login`
    } else if (loggedInSubSections[part1]?.has(part2)) {
      redirection = `${origin}/login`
    } else if (dropPart3[part1]?.has(part3)) {
      redirection = href.replace(`/${part3}`, '')
    }

    if (redirection) res.redirect(redirection)
    else next()
  }
}

const loggedInSections = new Set([
  'add',
  'network',
  'notifications',
  'settings',
  'tasks',
  'transactions',
])

const loggedInSubSections = {
  inventory: new Set([
    'network',
    'public',
    'nearby',
    'last',
  ]),
  entity: new Set([
    'new',
    'changes',
    'activity',
    'deduplicate',
  ])
}

const dropPart3 = {
  entity: new Set([
    'add',
    'edit',
    'cleanup',
  ])
}
