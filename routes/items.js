const express = require('express');
const Item = require('../models/Item');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Create item (Protected)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description } = req.body;
    const item = new Item({
      title,
      description,
      userId: req.userId
    });
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Read all items for user (Protected)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const items = await Item.find({ userId: req.userId });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Read single item (Protected)
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item || item.userId.toString() !== req.userId) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete item (Protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item || item.userId.toString() !== req.userId) {
      return res.status(404).json({ message: 'Item not found' });
    }
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
