const toJSON = require('../../utils/sequelize-json')

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
    return toJSON(this.dataValues)
  }

  Item.associate = (models) => {
    Item.hasMany(models.Order, { foreignKey: 'itemId' })
  }

  return Item
}
