const Boom = require('boom')

module.exports = async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    if (err.isBoom) {
      ctx.body = err.output.payload
      ctx.status = err.output.statusCode
    } else if (err.isJoi) {
      const newError = Boom.badRequest(err.name, err.details)
      ctx.body = Object.assign({}, { data: newError.data }, newError.output.payload)
      ctx.status = 400 // bad request
    }
  }
}
