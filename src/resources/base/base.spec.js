const assert = require('chai').assert

const app = require('../../server')
const request = require('supertest').agent(app.listen())

describe('ping', () => {
  it('pings successfully', (done) => {
    request.get('/ping')
      .expect(200)
      .end((err, res) => {
        if (err) throw err

        assert(res.body, 'OK', 'reply with OK as the response content')
        done()
      })
  })
})
