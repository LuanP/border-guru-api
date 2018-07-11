const path = require('path')
const env = process.env.NODE_ENV || 'development'
const root = path.join(__dirname, '..', '..')

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
  env: env
}

module.exports = base
