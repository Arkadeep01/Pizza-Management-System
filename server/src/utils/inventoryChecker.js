const PizzaBase = require('../models/PizzaBase');
const Sauce = require('../models/Sauce');
const Cheese = require('../models/Cheese');
const Topping = require('../models/Topping');
const { sendLowStockAlert } = require('./emailService');

// Check inventory levels for all items
exports.checkInventoryLevels = async () => {
  try {
    // Check pizza bases
    const bases = await PizzaBase.find();
    for (const base of bases) {
      if (base.quantity <= base.threshold) {
        await sendLowStockAlert('Pizza Base', base.name, base.quantity);
      }
    }

    // Check sauces
    const sauces = await Sauce.find();
    for (const sauce of sauces) {
      if (sauce.quantity <= sauce.threshold) {
        await sendLowStockAlert('Sauce', sauce.name, sauce.quantity);
      }
    }

    // Check cheeses
    const cheeses = await Cheese.find();
    for (const cheese of cheeses) {
      if (cheese.quantity <= cheese.threshold) {
        await sendLowStockAlert('Cheese', cheese.name, cheese.quantity);
      }
    }

    // Check toppings
    const toppings = await Topping.find();
    for (const topping of toppings) {
      if (topping.quantity <= topping.threshold) {
        await sendLowStockAlert('Topping', topping.name, topping.quantity);
      }
    }
  } catch (error) {
    console.error('Error checking inventory levels:', error);
  }
};

// Update inventory after order
exports.updateInventory = async (order) => {
  try {
    // Update pizza base
    await PizzaBase.findByIdAndUpdate(order.base, {
      $inc: { quantity: -1 }
    });

    // Update sauce
    await Sauce.findByIdAndUpdate(order.sauce, {
      $inc: { quantity: -1 }
    });

    // Update cheese
    await Cheese.findByIdAndUpdate(order.cheese, {
      $inc: { quantity: -1 }
    });

    // Update toppings
    for (const toppingId of order.toppings) {
      await Topping.findByIdAndUpdate(toppingId, {
        $inc: { quantity: -1 }
      });
    }
  } catch (error) {
    console.error('Error updating inventory:', error);
    throw error;
  }
};

// Restore inventory after order cancellation
exports.restoreInventory = async (order) => {
  try {
    // Restore pizza base
    await PizzaBase.findByIdAndUpdate(order.base, {
      $inc: { quantity: 1 }
    });

    // Restore sauce
    await Sauce.findByIdAndUpdate(order.sauce, {
      $inc: { quantity: 1 }
    });

    // Restore cheese
    await Cheese.findByIdAndUpdate(order.cheese, {
      $inc: { quantity: 1 }
    });

    // Restore toppings
    for (const toppingId of order.toppings) {
      await Topping.findByIdAndUpdate(toppingId, {
        $inc: { quantity: 1 }
      });
    }
  } catch (error) {
    console.error('Error restoring inventory:', error);
    throw error;
  }
}; 