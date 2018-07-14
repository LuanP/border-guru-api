const Router = require('koa-router')
const controller = require('./order.controller')

const router = new Router()

router.get('/', controller.getOrders)
router.post('/', controller.createOrder)

module.exports = router.routes()
