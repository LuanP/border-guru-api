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

Customer.updateCustomer = async (ctx) => {
  const paramsSchema = Joi.object({
    id: Joi.number().integer().required()
  }).required()

  const paramsResult = Joi.validate(ctx.params, paramsSchema, { abortEarly: false })
  if (paramsResult.error) {
    throw paramsResult.error
  }

  const bodySchema = Joi.object({
    name: Joi.string().max(255).required(),
    documentNumber: Joi.string().max(25).required(),
    email: Joi.string().email().required()
  }).required()

  const bodyResult = Joi.validate(ctx.request.body, bodySchema, { abortEarly: false })
  if (bodyResult.error) {
    throw bodyResult.error
  }

  await models.updateCustomer(paramsResult.value.id, bodyResult.value)

  ctx.body = await models.getCustomerById(paramsResult.value.id)
  ctx.status = 200
}

Customer.deleteCustomer = async (ctx) => {
  const schema = Joi.object({
    id: Joi.number().integer().required()
  }).required()

  const result = Joi.validate(ctx.params, schema, { abortEarly: false })
  if (result.error) {
    throw result.error
  }

  await models.deleteCustomer(result.value.id)

  ctx.status = 204
}

module.exports = Customer
