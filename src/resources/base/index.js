const Router = require('koa-router')
const controller = require('./base.controller')

const router = new Router()

router.get('/ping', controller.ping)

module.exports = router.routes()
