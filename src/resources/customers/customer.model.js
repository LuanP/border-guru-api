const CustomerSchema = require('../../utils/sequelize').Customer

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

module.exports = Customer
