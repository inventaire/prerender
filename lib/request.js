const fetch = require('node-fetch')

module.exports = {
  getJSON: url => fetch(url).then(res => res.json())
}
