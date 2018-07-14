const CustomerSchema = require('../../utils/sequelize').Customer

const Customer = () => {}

Customer.findOrCreateCustomer = async (customer, t) => {
  return CustomerSchema.findOrCreate({
    where: { name: customer.name },
    transaction: t
  })
}

module.exports = Customer
