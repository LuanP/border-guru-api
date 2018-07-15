const Router = require('koa-router')
const controller = require('./item.controller')

const router = new Router()

router.get('/informations', controller.getItemsInformations)
router.get('/:id/customers', controller.getCustomersByItemId)

module.exports = router.routes()
