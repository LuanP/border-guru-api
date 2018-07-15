const assert = require('chai').assert
const sinon = require('sinon')

const app = require('../../server')
const request = require('supertest').agent(app.listen())

const Op = require('sequelize').Op
const CustomerSchema = require('../../utils/sequelize').Customer
const OrderSchema = require('../../utils/sequelize').Order
const AddressSchema = require('../../utils/sequelize').Address
const ItemSchema = require('../../utils/sequelize').Item

const sandbox = sinon.createSandbox()

const _customer = Object.create({
  toJSON: () => {
    return {
      id: 1,
      name: 'Peter Lustig',
      createdAt: new Date('2018-07-15T02:18:30.000Z'),
      updatedAt: new Date('2018-07-15T02:18:30.000Z')
    }
  }
})

const _customerFull = Object.create({
  toJSON: () => {
    return {
      id: 1,
      name: 'Peter Lustig',
      documentNumber: '999999999',
      email: 'example@example.com',
      createdAt: new Date('2018-07-15T02:18:30.000Z'),
      updatedAt: new Date('2018-07-15T02:18:30.000Z')
    }
  }
})

const successResponse = {
  id: 1,
  name: 'Peter Lustig',
  createdAt: '2018-07-15T02:18:30.000Z',
  updatedAt: '2018-07-15T02:18:30.000Z'
}

const successFullResponse = {
  id: 1,
  name: 'Peter Lustig',
  documentNumber: '999999999',
  email: 'example@example.com',
  createdAt: '2018-07-15T02:18:30.000Z',
  updatedAt: '2018-07-15T02:18:30.000Z'
}

const customerUpdatebody = {
  name: 'Peter Lustig',
  documentNumber: '999999999',
  email: 'example@example.com'
}

const body404 = {
  statusCode: 404,
  error: 'Not Found',
  message: 'no customer found'
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

const _orders = [
  Object.create({
    toJSON: () => {
      return orderJson[0]
    }
  })
]

describe('customers resources', () => {
  beforeEach(() => {
    sandbox.stub(CustomerSchema, 'findOne')
    sandbox.stub(CustomerSchema, 'update')
    sandbox.stub(CustomerSchema, 'destroy')
    sandbox.stub(OrderSchema, 'findAll')
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('raises 404 if no customer found', (done) => {
    CustomerSchema.findOne.resolves(null)
    request.get('/v1/customers/1')
      .expect(404)
      .end((err, res) => {
        if (err) throw err

        sandbox.assert.calledOnce(CustomerSchema.findOne)

        assert.deepEqual(
          res.body,
          body404
        )

        done()
      })
  })

  it('successfully finds customer', (done) => {
    CustomerSchema.findOne.resolves(_customer)
    request.get('/v1/customers/1')
      .expect(200)
      .end((err, res) => {
        if (err) throw err

        sandbox.assert.calledOnce(CustomerSchema.findOne)
        sandbox.assert.calledWith(
          CustomerSchema.findOne,
          { where: { id: 1 } }
        )

        assert.deepEqual(
          res.body,
          successResponse
        )

        done()
      })
  })

  it('successfully updates customer', (done) => {
    CustomerSchema.update.resolves(null)
    CustomerSchema.findOne.resolves(_customerFull)
    request.put('/v1/customers/1')
      .send(customerUpdatebody)
      .expect(200)
      .end((err, res) => {
        if (err) throw err

        sandbox.assert.calledOnce(CustomerSchema.update)
        sandbox.assert.calledOnce(CustomerSchema.findOne)

        sandbox.assert.calledWith(
          CustomerSchema.update,
          {
            name: customerUpdatebody.name,
            documentNumber: customerUpdatebody.documentNumber,
            email: customerUpdatebody.email
          },
          { where: { id: { [Op.eq]: 1 } } }
        )

        assert.deepEqual(
          res.body,
          successFullResponse
        )

        done()
      })
  })

  it('successfully deletes customer', (done) => {
    CustomerSchema.destroy.resolves(null)
    request.delete('/v1/customers/1')
      .expect(204)
      .end((err, res) => {
        if (err) throw err

        sandbox.assert.calledOnce(CustomerSchema.destroy)

        sandbox.assert.calledWith(
          CustomerSchema.destroy,
          {
            where: {
              id: { [Op.eq]: 1 }
            }
          }
        )

        done()
      })
  })

  it('successfully finds all orders bought by a customer', (done) => {
    OrderSchema.findAll.resolves(_orders)

    request.get('/v1/customers/1/orders')
      .expect(200)
      .end((err, res) => {
        if (err) throw err

        sandbox.assert.calledOnce(OrderSchema.findAll)

        sandbox.assert.calledWith(
          OrderSchema.findAll,
          {
            where: { customerId: { [Op.eq]: 1 } },
            include: [
              AddressSchema,
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
})
