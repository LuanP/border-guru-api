const Router = require('koa-router')
const controller = require('./item.controller')

const router = new Router()

router.get('/informations', controller.getItemsInformations)

module.exports = router.routes()
