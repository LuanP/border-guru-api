const AddressSchema = require('../../utils/sequelize').Address

const Address = () => {}

Address.findOrCreateAddress = async (customer, address, t) => {
  return AddressSchema.findOrCreate({
    where: { customerId: customer.id, streetName: address.streetName },
    transaction: t
  })
}

module.exports = Address
