module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('orders', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      customerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'customer_id',
        references: {
          model: 'customers',
          key: 'id'
        },
        onDelete: 'NO ACTION'
      },
      addressId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'address_id',
        references: {
          model: 'addresses',
          key: 'id'
        },
        onDelete: 'NO ACTION'
      },
      itemId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'item_id',
        references: {
          model: 'items',
          key: 'id'
        },
        onDelete: 'NO ACTION'
      },
      priceAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        field: 'price_amount'
      },
      priceCurrency: {
        type: Sequelize.STRING(3),
        allowNull: false,
        field: 'price_currency'
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('CURRENT_TIMESTAMP'),
        allowNull: false,
        field: 'created_at'
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
        allowNull: false,
        field: 'updated_at'
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        field: 'deleted_at'
      }
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('orders')
  }
}
