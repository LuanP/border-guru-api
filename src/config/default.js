const path = require('path')
const env = process.env.NODE_ENV || 'development'
const root = path.join(__dirname, '..', '..')
const pjson = require('../../package.json')

const major = pjson.version.split('.')[0]

try {
  require('dotenv').config({path: path.join(root, `.env-${env.toLowerCase()}`)})
} catch (e) {
  console.log(
    `could not load dotenv.\nIf you want to use it, install the devDependencies and create a .env-${env} in the project root directory`
  )
}

const base = {
  port: process.env.PORT || 3000,
  ip: process.env.IP,
  majorVersion: major,
  logType: env === 'development' ? 'dev' : '',
  env: env,
  db: {
    username: process.env.DB_USERNAME || 'border_guru_username',
    password: process.env.DB_PASSWORD || 'border_guru_password',
    name: process.env.DB_NAME || 'border_guru_dbname',
    options: {
      host: process.env.DB_HOST || 'localhost',
      dialect: process.env.DB_DIALECT || 'mysql'
    }
  }
}

module.exports = base
