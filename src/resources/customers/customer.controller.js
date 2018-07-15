const Joi = require('joi')
const Boom = require('boom')

const models = require('./customer.model')

const Customer = () => {}

Customer.getCustomerById = async (ctx) => {
  const schema = Joi.object({
    id: Joi.number().integer().required()
  }).required()

  const result = Joi.validate(ctx.params, schema, { abortEarly: false })
  if (result.error) {
    throw result.error
  }

  const customer = await models.getCustomerById(result.value.id)

  if (customer === null) {
    throw Boom.notFound()
  }

  ctx.body = customer
  ctx.status = 200
}

module.exports = Customer
