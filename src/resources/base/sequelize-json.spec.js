const assert = require('chai').assert

const toJSON = require('../../utils/sequelize-json')

const obj = {
  id: 1,
  documentNumber: null,
  name: 'Macbook'
}

const resultObj = {
  id: 1,
  name: 'Macbook'
}

describe('sequelize-json', () => {
  it('returns data successfully', (done) => {
    const result = toJSON(obj)

    assert.deepEqual(
      result,
      resultObj
    )

    done()
  })
})
