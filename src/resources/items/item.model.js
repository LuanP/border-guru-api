const ItemSchema = require('../../utils/sequelize').Item

const Item = () => {}

Item.findOrCreateItem = async (item, t) => {
  return ItemSchema.findOrCreate({
    where: {
      name: item.name,
      priceAmount: item.price.amount,
      priceCurrency: item.price.currency
    },
    transaction: t
  })
}

module.exports = Item
