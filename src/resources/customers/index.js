const Router = require('koa-router')
const controller = require('./customer.controller')

const router = new Router()

router.get('/:id', controller.getCustomerById)

module.exports = router.routes()
