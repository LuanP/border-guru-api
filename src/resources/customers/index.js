const Router = require('koa-router')
const controller = require('./customer.controller')

const router = new Router()

router.get('/:id', controller.getCustomerById)
router.put('/:id', controller.updateCustomer)
router.delete('/:id', controller.deleteCustomer)

module.exports = router.routes()
