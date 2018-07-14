const mount = require('koa-mount')
const config = require('config')

module.exports = (app) => {
  app.use(mount('/', require('./resources/base')))
  app.use(mount(`/v${config.majorVersion}/orders`, require('./resources/orders')))
}
