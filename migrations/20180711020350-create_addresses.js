module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('addresses', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      streetName: {
        type: Sequelize.STRING(255),
        allowNull: false,
        field: 'street_name'
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
    }).then(() => queryInterface.addIndex('addresses', ['street_name'], {indexName: 'index_street_name'}))
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('addresses')
  }
}
