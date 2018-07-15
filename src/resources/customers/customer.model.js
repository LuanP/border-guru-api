const Op = require('sequelize').Op
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

module.exports = Customer
