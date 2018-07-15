const assert = require('chai').assert
const sinon = require('sinon')

const app = require('../../server')
const request = require('supertest').agent(app.listen())

const Op = require('sequelize').Op
const CustomerSchema = require('../../utils/sequelize').Customer

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
  message: 'Not Found'
}

describe('customers resources', () => {
  beforeEach(() => {
    sandbox.stub(CustomerSchema, 'findOne')
    sandbox.stub(CustomerSchema, 'update')
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
})
