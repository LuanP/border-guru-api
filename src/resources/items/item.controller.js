const Boom = require('boom')
const Joi = require('joi')
const models = require('./item.model')

const Item = () => {}

Item.getItemsInformations = async (ctx) => {
  const itemsInformations = await models.getItemsInformations()

  if (itemsInformations.length === 0) {
    throw Boom.notFound('no items informations')
  }

  ctx.body = itemsInformations
  ctx.status = 200
}

Item.getCustomersByItemId = async (ctx) => {
  const schema = Joi.object({
    id: Joi.number().integer().required()
  }).required()

  const result = Joi.validate(ctx.params, schema, { abortEarly: false })
  if (result.error) {
    throw result.error
  }

  const customers = await models.getCustomersByItemId(result.value.id)

  if (customers.length === 0) {
    throw Boom.notFound('no customers found')
  }

  ctx.body = customers
  ctx.status = 200
}

module.exports = Item
