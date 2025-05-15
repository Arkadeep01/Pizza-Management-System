const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { auth, adminAuth } = require('../middleware/auth');
const { sendLowStockAlert } = require('../utils/emailService');

// Get all inventory items (admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const bases = await PizzaBase.find();
    const sauces = await Sauce.find();
    const cheeses = await Cheese.find();
    const toppings = await Topping.find();

    res.json({
      bases,
      sauces,
      cheeses,
      toppings
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching inventory' });
  }
});

// Update pizza base stock (admin only)
router.put('/base/:id', adminAuth, [
  body('quantity').isInt({ min: 0 }),
  body('threshold').isInt({ min: 0 })
], async (req, res) => {
  try {
    const { quantity, threshold } = req.body;
    const base = await PizzaBase.findByIdAndUpdate(
      req.params.id,
      { quantity, threshold },
      { new: true }
    );

    if (!base) {
      return res.status(404).json({ message: 'Pizza base not found' });
    }

    // Check if stock is below threshold
    if (base.quantity <= base.threshold) {
      await sendLowStockAlert('Pizza Base', base.name, base.quantity);
    }

    res.json(base);
  } catch (error) {
    res.status(500).json({ message: 'Error updating pizza base stock' });
  }
});

// Update sauce stock (admin only)
router.put('/sauce/:id', adminAuth, [
  body('quantity').isInt({ min: 0 }),
  body('threshold').isInt({ min: 0 })
], async (req, res) => {
  try {
    const { quantity, threshold } = req.body;
    const sauce = await Sauce.findByIdAndUpdate(
      req.params.id,
      { quantity, threshold },
      { new: true }
    );

    if (!sauce) {
      return res.status(404).json({ message: 'Sauce not found' });
    }

    if (sauce.quantity <= sauce.threshold) {
      await sendLowStockAlert('Sauce', sauce.name, sauce.quantity);
    }

    res.json(sauce);
  } catch (error) {
    res.status(500).json({ message: 'Error updating sauce stock' });
  }
});

// Update cheese stock (admin only)
router.put('/cheese/:id', adminAuth, [
  body('quantity').isInt({ min: 0 }),
  body('threshold').isInt({ min: 0 })
], async (req, res) => {
  try {
    const { quantity, threshold } = req.body;
    const cheese = await Cheese.findByIdAndUpdate(
      req.params.id,
      { quantity, threshold },
      { new: true }
    );

    if (!cheese) {
      return res.status(404).json({ message: 'Cheese not found' });
    }

    if (cheese.quantity <= cheese.threshold) {
      await sendLowStockAlert('Cheese', cheese.name, cheese.quantity);
    }

    res.json(cheese);
  } catch (error) {
    res.status(500).json({ message: 'Error updating cheese stock' });
  }
});

// Update topping stock (admin only)
router.put('/topping/:id', adminAuth, [
  body('quantity').isInt({ min: 0 }),
  body('threshold').isInt({ min: 0 })
], async (req, res) => {
  try {
    const { quantity, threshold } = req.body;
    const topping = await Topping.findByIdAndUpdate(
      req.params.id,
      { quantity, threshold },
      { new: true }
    );

    if (!topping) {
      return res.status(404).json({ message: 'Topping not found' });
    }

    if (topping.quantity <= topping.threshold) {
      await sendLowStockAlert('Topping', topping.name, topping.quantity);
    }

    res.json(topping);
  } catch (error) {
    res.status(500).json({ message: 'Error updating topping stock' });
  }
});

// Add new inventory item (admin only)
router.post('/:type', adminAuth, [
  body('name').notEmpty(),
  body('quantity').isInt({ min: 0 }),
  body('threshold').isInt({ min: 0 }),
  body('price').isNumeric()
], async (req, res) => {
  try {
    const { name, quantity, threshold, price } = req.body;
    const type = req.params.type;

    let newItem;
    switch (type) {
      case 'base':
        newItem = new PizzaBase({ name, quantity, threshold, price });
        break;
      case 'sauce':
        newItem = new Sauce({ name, quantity, threshold, price });
        break;
      case 'cheese':
        newItem = new Cheese({ name, quantity, threshold, price });
        break;
      case 'topping':
        newItem = new Topping({ name, quantity, threshold, price });
        break;
      default:
        return res.status(400).json({ message: 'Invalid inventory type' });
    }

    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: 'Error adding inventory item' });
  }
});

// Delete inventory item (admin only)
router.delete('/:type/:id', adminAuth, async (req, res) => {
  try {
    const { type, id } = req.params;
    let deletedItem;

    switch (type) {
      case 'base':
        deletedItem = await PizzaBase.findByIdAndDelete(id);
        break;
      case 'sauce':
        deletedItem = await Sauce.findByIdAndDelete(id);
        break;
      case 'cheese':
        deletedItem = await Cheese.findByIdAndDelete(id);
        break;
      case 'topping':
        deletedItem = await Topping.findByIdAndDelete(id);
        break;
      default:
        return res.status(400).json({ message: 'Invalid inventory type' });
    }

    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting inventory item' });
  }
});

module.exports = router; 