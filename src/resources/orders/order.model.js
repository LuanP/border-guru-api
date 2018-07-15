const R = require('ramda')
const Op = require('sequelize').Op
const OrderSchema = require('../../utils/sequelize').Order
const CustomerSchema = require('../../utils/sequelize').Customer
const ItemSchema = require('../../utils/sequelize').Item
const AddressSchema = require('../../utils/sequelize').Address

const Order = () => {}

Order.standardResponse = (obj) => {
  obj = obj.toJSON()

  return {
    id: obj.id,
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
    address: {
      id: obj.address.id,
      streetName: obj.address.streetName,
      createdAt: obj.address.createdAt,
      updatedAt: obj.address.updatedAt
    },
    customer: {
      id: obj.customer.id,
      name: obj.customer.name,
      createdAt: obj.customer.createdAt,
      updatedAt: obj.customer.updatedAt
    },
    item: {
      id: obj.item.id,
      name: obj.item.name,
      createdAt: obj.item.createdAt,
      updatedAt: obj.item.updatedAt,
      price: {
        amount: obj.item.priceAmount,
        currency: obj.item.priceCurrency
      }
    },
    price: {
      amount: obj.priceAmount,
      currency: obj.priceCurrency
    }
  }
}

Order.getOrderById = async (orderId, t) => {
  return OrderSchema
    .findOne({
      where: { id: orderId },
      include: [
        CustomerSchema,
        AddressSchema,
        ItemSchema
      ],
      transaction: t
    })
    .then(Order.standardResponse)
}

Order.getOrders = async (customerName, customerAddress) => {
  const filters = {
    include: [
      {
        model: CustomerSchema,
        where: {}
      },
      {
        model: AddressSchema,
        where: {}
      },
      ItemSchema
    ]
  }

  if (customerName) {
    filters.include[0].where['name'] = {
      [Op.eq]: customerName
    }
  }

  if (customerAddress) {
    filters.include[1].where['streetName'] = {
      [Op.eq]: customerAddress
    }
  }

  return OrderSchema
    .findAll(filters)
    .then((orders) => {
      return R.map(Order.standardResponse, orders)
    })
}

Order.createOrder = async (customer, address, item, t) => {
  return OrderSchema.create(
    {
      customerId: customer.id,
      addressId: address.id,
      itemId: item.id,
      priceAmount: item.priceAmount,
      priceCurrency: item.priceCurrency
    },
    { transaction: t }
  )
}

Order.deleteOrder = async (orderId) => {
  return OrderSchema.destroy({
    where: {
      id: { [Op.eq]: orderId }
    }
  })
}

Order.updateOrder = async (orderId, customer, address, item, t) => {
  return OrderSchema.update(
    {
      customerId: customer.id,
      addressId: address.id,
      itemId: item.id,
      priceAmount: item.priceAmount,
      priceCurrency: item.priceCurrency
    },
    {
      where: { id: { [Op.eq]: orderId } },
      transaction: t
    }
  )
}

module.exports = Order
