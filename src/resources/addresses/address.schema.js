const toJSON = require('../../utils/sequelize-json')

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
    return toJSON(this.dataValues)
  }

  Address.associate = (models) => {
    Address.belongsTo(models.Customer, { foreignKey: 'id' })
  }

  return Address
}
