const assert = require('chai').assert
const sinon = require('sinon')

const app = require('../../server')
const request = require('supertest').agent(app.listen())

const OrderSchema = require('../../utils/sequelize').Order

const sandbox = sinon.createSandbox()

const item1 = {
  toJSON: () => {
    return {
      ordered: 3,
      item: {
        id: 2,
        name: 'Macbook'
      }
    }
  }
}

const item2 = {
  toJSON: () => {
    return {
      ordered: 3,
      item: {
        id: 7,
        name: 'Mb'
      }
    }
  }
}

const item3 = {
  toJSON: () => {
    return {
      ordered: 3,
      item: {
        id: 6,
        name: 'Mc'
      }
    }
  }
}

const item4 = {
  toJSON: () => {
    return {
      ordered: 1,
      item: {
        id: 3,
        name: 'Cellphone'
      }
    }
  }
}

const itemsInformationsResult = [
  Object.create(item1),
  Object.create(item2),
  Object.create(item3),
  Object.create(item4)
]

const successResponse = [
  {
    item: {
      id: 2,
      name: 'Macbook'
    },
    info: {
      ordered: {
        times: 3
      }
    }
  },
  {
    item: {
      id: 7,
      name: 'Mb'
    },
    info: {
      ordered: {
        times: 3
      }
    }
  },
  {
    item: {
      id: 6,
      name: 'Mc'
    },
    info: {
      ordered: {
        times: 3
      }
    }
  },
  {
    item: {
      id: 3,
      name: 'Cellphone'
    },
    info: {
      ordered: {
        times: 1
      }
    }
  }
]

describe('items resources', () => {
  beforeEach(() => {
    sandbox.stub(OrderSchema, 'findAll')
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('raises 404 if there are no items informations', (done) => {
    OrderSchema.findAll.resolves([])
    request.get('/v1/items/informations')
      .expect(404)
      .end((err, res) => {
        if (err) throw err

        sandbox.assert.calledOnce(OrderSchema.findAll)
        done()
      })
  })

  it('successfully gets items informations', (done) => {
    OrderSchema.findAll.resolves(itemsInformationsResult)
    request.get('/v1/items/informations')
      .expect(200)
      .end((err, res) => {
        if (err) throw err

        sandbox.assert.calledOnce(OrderSchema.findAll)

        assert.deepEqual(
          res.body,
          successResponse
        )

        done()
      })
  })
})
