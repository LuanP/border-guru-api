module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn(
          'customers',
          'document_number',
          {
            allowNull: true,
            type: Sequelize.STRING(25),
            field: 'document_number'
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          'customers',
          'email',
          {
            type: Sequelize.STRING(255),
            allowNull: true
          },
          { transaction: t }
        )
      ])
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn(
          'customers',
          'document_number',
          { transaction: t }
        ),
        queryInterface.removeColumn(
          'customers',
          'email',
          { transaction: t }
        )
      ])
    })
  }
}
