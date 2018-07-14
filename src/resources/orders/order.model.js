const R = require('ramda')
const OrderSchema = require('../../utils/sequelize').Order
const CustomerSchema = require('../../utils/sequelize').Customer
const ItemSchema = require('../../utils/sequelize').Item
const AddressSchema = require('../../utils/sequelize').Address

const Order = () => {}

Order.getOrders = async (customerName, customerAddress) => {
  return OrderSchema.findAll({
    include: [
      {
        model: CustomerSchema,
        include: [AddressSchema]
      },
      ItemSchema
    ]
  }).then((orders) => {
    return R.map(
      (obj) => {
        return R.pick(
          ['id', 'priceAmount', 'priceCurrency', 'createdAt', 'updatedAt', 'customer', 'item'],
          obj.toJSON()
        )
      },
      orders
    )
  })
}

module.exports = Order
