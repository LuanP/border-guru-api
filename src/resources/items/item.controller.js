const Boom = require('boom')
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

module.exports = Item
