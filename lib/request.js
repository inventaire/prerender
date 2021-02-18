const fetch = require('node-fetch')
const options = {
  headers: {
    'user-agent': 'inventaire/prerender',
    'accept': 'application/json'
  }
}

module.exports = {
  getJSON: url => fetch(url, options).then(res => res.json())
}
