const assert = require('chai').assert
const sinon = require('sinon')

const app = require('../../server')
const request = require('supertest').agent(app.listen())

const OrderSchema = require('../../utils/sequelize').Order
const models = require('./order.model')

const sandbox = sinon.createSandbox()

const _order = {
  toJSON: () => {
    return [
      {
        id: 1,
        customerId: 1,
        itemId: 1,
        priceAmount: '10.50',
        priceCurrency: 'usd',
        createdAt: '2018-07-14T04:16:52.000Z',
        updatedAt: '2018-07-14T04:16:52.000Z'
      }
    ]
  }
}
const order = Object.create(_order)

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
    sandbox.stub(OrderSchema, 'findAll')
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

  it('successfully finds orders from customer', (done) => {
    OrderSchema.findAll.resolves(order)
    request.get('/v1/orders?customer.name=Peter Lustig')
      .expect(200)
      .end((err, res) => {
        if (err) throw err

        sandbox.assert.calledWith(
          models.getOrders,
          'Peter Lustig',
          undefined
        )

        done()
      })
  })
})
