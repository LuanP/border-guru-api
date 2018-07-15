const Router = require('koa-router')
const controller = require('./customer.controller')

const router = new Router()

router.get('/informations', controller.getCustomersInformations)
router.get('/:id', controller.getCustomerById)
router.put('/:id', controller.updateCustomer)
router.delete('/:id', controller.deleteCustomer)
router.get('/:id/orders', controller.findOrdersByCustomerId)

module.exports = router.routes()
