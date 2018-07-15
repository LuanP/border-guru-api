const R = require('ramda')
const Op = require('sequelize').Op
const sequelize = require('../../utils/sequelize').sequelize
const ItemSchema = require('../../utils/sequelize').Item
const OrderSchema = require('../../utils/sequelize').Order
const CustomerSchema = require('../../utils/sequelize').Customer

const Item = () => {}

Item.findOrCreateItem = async (item, t) => {
  return ItemSchema.findOrCreate({
    where: {
      name: item.name,
      priceAmount: item.price.amount,
      priceCurrency: item.price.currency
    },
    transaction: t
  })
}

Item.getItemsInformations = async () => {
  return OrderSchema
    .findAll({
      include: [ItemSchema],
      group: ['Item.id', 'Item.name'],
      attributes: [
        'Item.id',
        'Item.name',
        [sequelize.fn('COUNT', sequelize.col('Item.id')), 'ordered']
      ],
      order: sequelize.literal('ordered DESC, Item.name ASC')
    })
    .then(
      R.map((result) => {
        const obj = result.toJSON()
        return {
          item: {
            id: obj.item.id,
            name: obj.item.name
          },
          info: {
            ordered: {
              times: obj.ordered
            }
          }
        }
      })
    )
}

Item.getCustomersByItemId = async (itemId) => {
  return OrderSchema.findAll({
    where: {
      itemId: { [Op.eq]: itemId }
    },
    attibutes: ['Customer'],
    include: [CustomerSchema]
  }).then(
    (orders) => {
      const response = []
      R.map((obj) => {
        const order = obj.toJSON()
        if (order.customer === undefined) {
          // deleted customer
          return
        }

        response.push(order.customer)
      })(orders)

      return response
    }
  )
}

module.exports = Item
