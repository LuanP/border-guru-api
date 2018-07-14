const OrderSchema = require('../../utils/sequelize').Order

const Order = () => {}

Order.getOrders = async (customerName, customerAddress) => {
  return OrderSchema.findAll()
}

module.exports = Order
