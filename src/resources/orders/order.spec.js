const R = require('ramda')
const assert = require('chai').assert
const sinon = require('sinon')
const Op = require('sequelize').Op

const app = require('../../server')
const request = require('supertest').agent(app.listen())

const sequelize = require('../../utils/sequelize').sequelize
const CustomerSchema = require('../../utils/sequelize').Customer
const AddressSchema = require('../../utils/sequelize').Address
const ItemSchema = require('../../utils/sequelize').Item
const OrderSchema = require('../../utils/sequelize').Order
const models = require('./order.model')

const sandbox = sinon.createSandbox()

const createOrderBody = {
  customer: {
    name: 'Peter Lustig',
    address: {
      streetName: 'Steindamm 80'
    }
  },
  item: {
    name: 'Macbook',
    price: {
      amount: '1700.00',
      currency: 'EUR'
    }
  }
}

const orderJson = [
  {
    id: 1,
    customerId: 1,
    itemId: 1,
    priceAmount: '1700.00',
    priceCurrency: 'EUR',
    createdAt: '2018-07-14T04:16:52.000Z',
    updatedAt: '2018-07-14T04:16:52.000Z',
    address: {
      id: 1,
      streetName: 'Steindamm 80',
      createdAt: '2018-07-14T04:15:28.000Z',
      updatedAt: '2018-07-14T04:15:28.000Z'
    },
    customer: {
      id: 1,
      name: 'Peter Lustig',
      createdAt: '2018-07-14T04:15:14.000Z',
      updatedAt: '2018-07-14T04:15:14.000Z'
    },
    item: {
      id: 1,
      name: 'Macbook',
      priceAmount: '1700.00',
      priceCurrency: 'EUR',
      createdAt: '2018-07-14T04:16:15.000Z',
      updatedAt: '2018-07-14T04:16:15.000Z'
    }
  }
]

const orderResponse = [
  {
    id: orderJson[0].id,
    createdAt: orderJson[0].createdAt,
    updatedAt: orderJson[0].updatedAt,
    address: {
      id: 1,
      streetName: 'Steindamm 80',
      createdAt: '2018-07-14T04:15:28.000Z',
      updatedAt: '2018-07-14T04:15:28.000Z'
    },
    customer: {
      id: orderJson[0].customer.id,
      name: orderJson[0].customer.name,
      createdAt: orderJson[0].customer.createdAt,
      updatedAt: orderJson[0].customer.updatedAt
    },
    item: {
      id: orderJson[0].item.id,
      name: orderJson[0].item.name,
      createdAt: orderJson[0].item.createdAt,
      updatedAt: orderJson[0].item.updatedAt,
      price: {
        amount: orderJson[0].item.priceAmount,
        currency: orderJson[0].item.priceCurrency
      }
    },
    price: {
      amount: orderJson[0].priceAmount,
      currency: orderJson[0].priceCurrency
    }
  }
]

const _customer = Object.create({
  toJSON: () => {
    return {
      id: 1,
      name: 'Peter Lustig'
    }
  }
})

const _address = Object.create({
  toJSON: () => {
    return {
      id: 1,
      streetName: 'Steindamm 80'
    }
  }
})

const _item = Object.create({
  toJSON: () => {
    return {
      id: 1,
      name: 'Macbook',
      priceAmount: '1700.00',
      priceCurrency: 'EUR'
    }
  }
})

const _order = {
  id: 1,
  toJSON: () => {
    return orderJson[0]
  }
}
const orders = [Object.create(_order)]

const validationResponseBody = {
  data: [
    {
      message: '\"customer.na\" is not allowed', // eslint-disable-line no-useless-escape
      path: [
        'customer.na'
      ],
      type: 'object.allowUnknown',
      context: {
        child: 'customer.na',
        key: 'customer.na',
        label: 'customer.na'
      }
    }
  ],
  statusCode: 400,
  error: 'Bad Request',
  message: 'ValidationError'
}

describe('orders resource', () => {
  beforeEach(() => {
    sandbox.stub(sequelize, 'transaction')
    sandbox.stub(OrderSchema, 'findAll')
    sandbox.stub(CustomerSchema, 'findOrCreate')
    sandbox.stub(AddressSchema, 'findOrCreate')
    sandbox.stub(ItemSchema, 'findOrCreate')
    sandbox.stub(OrderSchema, 'create')
    sandbox.stub(OrderSchema, 'findOne')
    sandbox.stub(OrderSchema, 'destroy')
    sandbox.stub(OrderSchema, 'update')
    sandbox.spy(models, 'getOrders')
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('raises 404 if no orders found', (done) => {
    OrderSchema.findAll.resolves([])
    request.get('/v1/orders')
      .expect(404)
      .end((err, res) => {
        if (err) throw err

        sandbox.assert.calledWith(
          models.getOrders,
          undefined,
          undefined
        )

        assert.deepEqual(
          res.body,
          { statusCode: 404, error: 'Not Found', message: 'no orders found' },
          'error response body must be in boom standard body'
        )

        done()
      })
  })

  it('raises 400 with invalid query string', (done) => {
    OrderSchema.findAll.resolves([])
    request.get('/v1/orders?customer.na=12')
      .expect(400)
      .end((err, res) => {
        if (err) throw err

        sandbox.assert.notCalled(models.getOrders)

        assert.deepEqual(
          res.body,
          validationResponseBody,
          'error response body must be in boom standard body with joi data'
        )

        done()
      })
  })

  it('successfully finds orders', (done) => {
    OrderSchema.findAll.resolves(orders)
    request.get('/v1/orders')
      .expect(200)
      .end((err, res) => {
        if (err) throw err

        sandbox.assert.calledWith(
          models.getOrders,
          undefined,
          undefined
        )

        assert.deepEqual(
          res.body,
          orderResponse
        )

        done()
      })
  })

  it('successfully finds orders with customer name', (done) => {
    OrderSchema.findAll.resolves(orders)
    request.get('/v1/orders?customer.name=Peter Lustig')
      .expect(200)
      .end((err, res) => {
        if (err) throw err

        sandbox.assert.calledWith(
          models.getOrders,
          'Peter Lustig',
          undefined
        )

        sandbox.assert.calledWith(
          OrderSchema.findAll,
          {
            include: [
              {
                model: CustomerSchema,
                where: { name: { [Op.eq]: 'Peter Lustig' } }
              },
              {
                model: AddressSchema,
                where: {}
              },
              ItemSchema
            ]
          }
        )

        assert.deepEqual(
          res.body,
          orderResponse
        )

        done()
      })
  })

  it('successfully finds orders with customer address', (done) => {
    OrderSchema.findAll.resolves(orders)
    request.get('/v1/orders?customer.address=Steindamm 80')
      .expect(200)
      .end((err, res) => {
        if (err) throw err

        sandbox.assert.calledWith(
          models.getOrders,
          undefined,
          'Steindamm 80'
        )

        sandbox.assert.calledWith(
          OrderSchema.findAll,
          {
            include: [
              {
                model: CustomerSchema,
                where: {}
              },
              {
                model: AddressSchema,
                where: { streetName: { [Op.eq]: 'Steindamm 80' } }
              },
              ItemSchema
            ]
          }
        )

        assert.deepEqual(
          res.body,
          orderResponse
        )

        done()
      })
  })

  it('raises validation error on create order', (done) => {
    const invalidCreateOrderBody = R.clone(createOrderBody)
    delete invalidCreateOrderBody['customer']['address']

    request.post('/v1/orders')
      .send(invalidCreateOrderBody)
      .expect(400)
      .end((err, res) => {
        if (err) throw err

        done()
      })
  })

  it('successfully creates order', (done) => {
    sequelize.transaction.yields(null)
    CustomerSchema.findOrCreate.resolves([_customer])
    AddressSchema.findOrCreate.resolves([_address])
    ItemSchema.findOrCreate.resolves([_item])
    OrderSchema.create.resolves(_order)
    OrderSchema.findOne.resolves(orders[0])

    request.post('/v1/orders')
      .send(createOrderBody)
      .expect(201)
      .end((err, res) => {
        if (err) throw err

        sandbox.assert.calledOnce(sequelize.transaction)
        sandbox.assert.calledOnce(CustomerSchema.findOrCreate)
        sandbox.assert.calledOnce(AddressSchema.findOrCreate)
        sandbox.assert.calledOnce(ItemSchema.findOrCreate)
        sandbox.assert.calledOnce(OrderSchema.create)
        sandbox.assert.calledOnce(OrderSchema.findOne)

        sandbox.assert.calledWith(
          OrderSchema.create,
          {
            customerId: orderResponse[0].customer.id,
            addressId: orderResponse[0].address.id,
            itemId: orderResponse[0].item.id,
            priceAmount: orderResponse[0].price.amount,
            priceCurrency: orderResponse[0].price.currency
          },
          { transaction: null }
        )

        assert.deepEqual(
          res.body,
          orderResponse[0],
          'order must be in standard format'
        )

        const orderId = orderResponse[0].id
        assert(
          res.headers['location'] === `/v1/orders/${orderId}`,
          'location header must point to the new object'
        )

        done()
      })
  })

  it('successfully deletes order', (done) => {
    OrderSchema.destroy.resolves(null)
    request.delete('/v1/orders/1')
      .expect(204)
      .end((err, res) => {
        if (err) throw err

        sandbox.assert.calledOnce(OrderSchema.destroy)
        sandbox.assert.calledWith(
          OrderSchema.destroy,
          {
            where: {
              id: { [Op.eq]: 1 }
            }
          }
        )

        done()
      })
  })

  it('successfully updates order', (done) => {
    sequelize.transaction.yields(null)
    CustomerSchema.findOrCreate.resolves([_customer])
    AddressSchema.findOrCreate.resolves([_address])
    ItemSchema.findOrCreate.resolves([_item])
    OrderSchema.update.resolves(null)
    OrderSchema.findOne.resolves(orders[0])

    request.put('/v1/orders/1')
      .send(createOrderBody)
      .expect(200)
      .end((err, res) => {
        if (err) throw err

        sandbox.assert.calledOnce(sequelize.transaction)
        sandbox.assert.calledOnce(CustomerSchema.findOrCreate)
        sandbox.assert.calledOnce(AddressSchema.findOrCreate)
        sandbox.assert.calledOnce(ItemSchema.findOrCreate)
        sandbox.assert.calledOnce(OrderSchema.update)
        sandbox.assert.calledOnce(OrderSchema.findOne)

        sandbox.assert.calledWith(
          OrderSchema.update,
          {
            customerId: orderResponse[0].customer.id,
            addressId: orderResponse[0].address.id,
            itemId: orderResponse[0].item.id,
            priceAmount: orderResponse[0].price.amount,
            priceCurrency: orderResponse[0].price.currency
          },
          {
            where: {
              id: { [Op.eq]: 1 }
            },
            transaction: null
          }
        )

        assert.deepEqual(
          res.body,
          orderResponse[0],
          'order must be in standard format'
        )

        done()
      })
  })
})
