const R = require('ramda')

module.exports = (sequelize, DataTypes) => {
  let Address = sequelize.define('Address',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      customerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'customer_id',
        references: {
          model: 'customers',
          key: 'id'
        }
      },
      streetName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'street_name'
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
    { tableName: 'addresses' }
  )

  Address.prototype.toJSON = function () {
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

  Address.associate = (models) => {
    Address.belongsTo(models.Customer, { foreignKey: 'id' })
  }

  return Address
}
