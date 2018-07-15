const R = require('ramda')

module.exports = (sequelize, DataTypes) => {
  let Customer = sequelize.define('Customer',
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
      documentNumber: {
        type: DataTypes.STRING(25),
        allowNull: true,
        field: 'document_number'
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: true
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
    { tableName: 'customers' }
  )

  Customer.prototype.toJSON = function () {
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

  Customer.associate = (models) => {
    Customer.hasMany(models.Order, { foreignKey: 'id' })
    Customer.hasMany(models.Address, { foreignKey: 'id' })
  }

  return Customer
}
