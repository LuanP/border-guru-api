process.env.NODE_ENV = process.env.NODE_ENV || 'development'
process.env.NODE_CONFIG_DIR = process.env.NODE_CONFIG_DIR || './src/config'

const config = require('config')
const Koa = require('koa')
const app = new Koa()

if (!module.parent) {
  app.listen(config.port, config.ip, function () {
    console.log('Koa server listening on %d, in %s mode', config.port, config.env)
  })
}

module.exports = app
