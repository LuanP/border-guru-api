const Base = () => {}

Base.ping = async (ctx) => {
  ctx.body = 'OK'
}

module.exports = Base
