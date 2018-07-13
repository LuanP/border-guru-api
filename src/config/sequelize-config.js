const config = require('config')
const db = config.db

const dbConfig = {
  username: db.username,
  password: db.password,
  database: db.name,
  host: db.options.host,
  dialect: config.db.options.dialect
}

module.exports = {
  test: dbConfig,
  development: dbConfig,
  stage: dbConfig,
  production: dbConfig
}
