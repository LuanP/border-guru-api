const R = require('ramda')

module.exports = (dataValues) => {
  const objs = R.compose(
    (obj) => {
      if (obj.hasOwnProperty('toJSON')) {
        return obj.toJSON()
      }

      return R.pickBy((o) => !R.isNil(o) && !R.isEmpty(o), obj)
    },
    R.pickBy((obj) => R.is(Object, obj) && !R.is(Date, obj))
  )(dataValues)

  const newDataValues = R.pickBy(
    (obj) => !R.isNil(obj) && !R.isEmpty(obj),
    Object.assign({}, dataValues, objs)
  )

  const standardOutput = {}
  for (let key in newDataValues) {
    standardOutput[`${key[0].toLowerCase()}${key.slice(1)}`] = newDataValues[key]
  }

  return standardOutput
}
