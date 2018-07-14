const Boom = require('boom')
const Joi = require('joi')

const models = require('./order.model')

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

module.exports = Order
