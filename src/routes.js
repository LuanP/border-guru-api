const mount = require('koa-mount')
const pjson = require('../package.json')

const major = pjson.version.split('.')[0]

module.exports = (app) => {
  app.use(mount('/', require('./resources/base')))
  app.use(mount(`/v${major}/orders`, require('./resources/orders')))
}
