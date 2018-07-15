const toJSON = require('../../utils/sequelize-json')

module.exports = (sequelize, DataTypes) => {
  let Order = sequelize.define('Order',
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
        },
        onDelete: 'no action'
      },
      addressId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'address_id',
        references: {
          model: 'addresses',
          key: 'id'
        },
        onDelete: 'no action'
      },
      itemId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'item_id',
        references: {
          model: 'items',
          key: 'id'
        },
        onDelete: 'no action'
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
    { tableName: 'orders' }
  )

  Order.prototype.toJSON = function () {
    return toJSON(this.dataValues)
  }

  Order.associate = (models) => {
    Order.belongsTo(models.Item, { foreignKey: 'itemId' })
    Order.belongsTo(models.Customer, { foreignKey: 'customerId' })
    Order.belongsTo(models.Address, { foreignKey: 'addressId' })
  }

  return Order
}
