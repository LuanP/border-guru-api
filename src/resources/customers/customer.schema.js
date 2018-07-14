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
    return R.pickBy((customer) => !R.isNil(customer) && !R.isEmpty(customer), this.dataValues)
  }

  Customer.associate = (models) => {
    Customer.hasMany(models.Order, { foreignKey: 'id' })
    Customer.hasMany(models.Address, { foreignKey: 'id' })
  }

  return Customer
}
