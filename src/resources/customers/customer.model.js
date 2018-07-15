const R = require('ramda')
const Op = require('sequelize').Op
const CustomerSchema = require('../../utils/sequelize').Customer
const OrderSchema = require('../../utils/sequelize').Order
const AddressSchema = require('../../utils/sequelize').Address
const ItemSchema = require('../../utils/sequelize').Item

const Customer = () => {}

Customer.findOrCreateCustomer = async (customer, t) => {
  return CustomerSchema.findOrCreate({
    where: { name: customer.name },
    transaction: t
  })
}

Customer.getCustomerById = async (customerId) => {
  return CustomerSchema.findOne({
    where: { id: customerId }
  })
}

Customer.updateCustomer = async (customerId, customerBody) => {
  return CustomerSchema.update(
    {
      name: customerBody.name,
      documentNumber: customerBody.documentNumber,
      email: customerBody.email
    },
    {
      where: { id: { [Op.eq]: customerId } }
    }
  )
}

Customer.deleteCustomer = async (customerId) => {
  return CustomerSchema.destroy({
    where: {
      id: { [Op.eq]: customerId }
    }
  })
}

Customer.findOrdersByCustomerId = async (customerId) => {
  return OrderSchema.findAll({
    where: { customerId: { [Op.eq]: customerId } },
    include: [
      AddressSchema,
      ItemSchema
    ]
  })
}

Customer.getCustomersInformations = async () => {
  return CustomerSchema
    .findAll({
      include: [OrderSchema]
    })
    .then((customers) => {
      const response = []

      R.map((customer) => {
        const obj = customer.toJSON()
        const standardInfo = {
          info: {}
        }

        const orders = obj.orders
        delete obj.orders

        const auxStandardInfo = {}
        R.map((order) => {
          if (R.is(Array, auxStandardInfo[order.priceCurrency])) {
            auxStandardInfo[order.priceCurrency].push(order.priceAmount)
          } else {
            auxStandardInfo[order.priceCurrency] = [order.priceAmount]
          }
        }, orders)

        R.mapObjIndexed((amounts, currency) => {
          standardInfo.info[currency] = {
            spent: R.sum(amounts)
          }
        })(auxStandardInfo)

        response.push(Object.assign({}, obj, standardInfo))
      })(customers)

      return response
    })
}

module.exports = Customer
