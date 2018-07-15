const Router = require('koa-router')
const controller = require('./order.controller')

const router = new Router()

router.get('/', controller.getOrders)
router.post('/', controller.createOrder)
router.delete('/:id', controller.deleteOrder)
router.put('/:id', controller.updateOrder)

module.exports = router.routes()
