const R = require('ramda')
const Op = require('sequelize').Op
const sequelize = require('../../utils/sequelize').sequelize
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
    customer: obj.customer,
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
        {
          model: CustomerSchema,
          include: [AddressSchema]
        },
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
        include: [AddressSchema],
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
    filters.where = sequelize.where(
      sequelize.col('Customer->Addresses.street_name'),
      customerAddress
    )
  }

  return OrderSchema
    .findAll(filters)
    .then((orders) => {
      return R.map(Order.standardResponse, orders)
    })
}

Order.createOrder = async (customer, item, t) => {
  return OrderSchema.create(
    {
      customerId: customer.id,
      itemId: item.id,
      priceAmount: item.priceAmount,
      priceCurrency: item.priceCurrency
    },
    { transaction: t }
  )
}

module.exports = Order
