const R = require('ramda')

module.exports = (sequelize, DataTypes) => {
  let Item = sequelize.define('Item',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      priceAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: 'price_amount'
      },
      priceCurrency: {
        type: DataTypes.STRING(3),
        allowNull: false,
        field: 'price_currency'
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
        field: 'created_at'
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
        field: 'updated_at'
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'deleted_at'
      }
    },
    { tableName: 'items' }
  )

  Item.prototype.toJSON = function () {
    const objs = R.compose(
      (obj) => {
        if (obj.hasOwnProperty('toJSON')) {
          return obj.toJSON()
        }

        return R.pickBy((o) => !R.isNil(o) && !R.isEmpty(o), obj)
      },
      R.pickBy((obj) => R.is(Object, obj) && !R.is(Date, obj))
    )(this.dataValues)

    const newDataValues = R.pickBy(
      (obj) => !R.isNil(obj) && !R.isEmpty(obj),
      Object.assign({}, this.dataValues, objs)
    )

    const standardOutput = {}
    for (let key in newDataValues) {
      standardOutput[`${key[0].toLowerCase()}${key.slice(1)}`] = newDataValues[key]
    }

    return standardOutput
  }

  Item.associate = (models) => {
    Item.hasMany(models.Order, { foreignKey: 'itemId' })
  }

  return Item
}
