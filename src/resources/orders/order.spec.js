const sinon = require('sinon')

const app = require('../../server')
const request = require('supertest').agent(app.listen())

const OrderSchema = require('../../utils/sequelize').Order

const sandbox = sinon.createSandbox()

describe('orders resource', () => {
  beforeEach(() => {
    sandbox.stub(OrderSchema, 'findAll')
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('successfully finds orders from customer', (done) => {
    request.get('/v1/orders?customer.name=Peter Lustig')
      .expect(200)
      .end((err, res) => {
        if (err) throw err

        done()
      })
  })
})
