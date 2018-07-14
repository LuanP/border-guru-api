const Router = require('koa-router')
const controller = require('./order.controller')

const router = new Router()

router.get('/', controller.getOrders)

module.exports = router.routes()
