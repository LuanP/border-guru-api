const mount = require('koa-mount')

module.exports = (app) => {
  app.use(mount('/', require('./resources/base')))
}
