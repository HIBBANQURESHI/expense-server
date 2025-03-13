import express from 'express';
import CardEntry from '../models/CardEntry.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const newEntry = new CardEntry(req.body);
    await newEntry.save();
    res.status(201).json(newEntry);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { startDate, endDate, type } = req.query;
    const filter = {};
    if(startDate && endDate) filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    if(type) filter.type = type;
    
    const entries = await CardEntry.find(filter).sort({ date: -1 });
    const credits = entries.filter(e => e.type === 'credit').reduce((a, b) => a + b.amount, 0);
    const debits = entries.filter(e => e.type === 'debit').reduce((a, b) => a + b.amount, 0);
    res.json({ entries, credits, debits, balance: credits - debits });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await CardEntry.findByIdAndDelete(req.params.id);
    res.json({ message: 'Entry deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;