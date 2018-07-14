const Boom = require('boom')
const Joi = require('joi')

const config = require('config')
const customerModel = require('../customers/customer.model')
const addressModel = require('../addresses/address.model')
const itemModel = require('../items/item.model')
const models = require('./order.model')
const sequelize = require('../../utils/sequelize').sequelize

const Order = () => {}

Order.getOrders = async (ctx) => {
  const schema = Joi.object().keys({
    'customer.name': Joi.string(),
    'customer.address': Joi.string()
  })

  const result = Joi.validate(ctx.query, schema, { abortEarly: false })
  if (result.error) {
    throw result.error
  }

  const orders = await models.getOrders(
    result.value['customer.name'],
    result.value['customer.address']
  )

  if (orders.length === 0) {
    throw Boom.notFound('no orders found')
  }

  ctx.body = orders
}

Order.createOrder = async (ctx) => {
  const schema = Joi.object().keys({
    customer: Joi.object().keys({
      name: Joi.string().required(),
      address: Joi.object().keys({
        streetName: Joi.string().required()
      }).required()
    }).required(),
    item: Joi.object().keys({
      name: Joi.string(),
      price: Joi.object().keys({
        amount: Joi.string().required(),
        currency: Joi.string().required()
      }).required()
    }).required()
  }).required()

  const result = Joi.validate(ctx.request.body, schema, { abortEarly: false })
  if (result.error) {
    throw result.error
  }

  const order = result.value
  await sequelize.transaction(async (t) => {
    const _customer = await customerModel.findOrCreateCustomer(order.customer, t)
    const customer = _customer[0].toJSON()

    await addressModel.findOrCreateAddress(customer, order.customer.address, t)

    const _item = await itemModel.findOrCreateItem(order.item, t)
    const item = _item[0].toJSON()

    const newOrder = await models.createOrder(customer, item, t)

    ctx.set('location', `/v${config.majorVersion}/orders/${newOrder.id}`)
    ctx.body = await models.getOrderById(newOrder.id, t)
    ctx.status = 201
  })
}

Order.deleteOrder = async (ctx) => {
  const schema = Joi.object().keys({
    id: Joi.number().integer().required()
  }).required()

  const result = Joi.validate(ctx.params, schema, { abortEarly: false })
  if (result.error) {
    throw result.error
  }

  await models.deleteOrder(result.value.id)

  ctx.status = 204
}

module.exports = Order
