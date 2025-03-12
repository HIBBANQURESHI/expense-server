import express from 'express';
import OpeningBalance from '../models/OpeningBalance.js';
import Expense from '../models/Expense.js';
import mongoose from 'mongoose';

const router = express.Router();

// Get balance sheet data
router.get('/', async (req, res) => {
  try {
    // Get opening balance
    const openingBalance = await OpeningBalance.findOne().sort({ date: -1 });

    // Get cash inflows (cash sales, receivings)
    const cashInflows = await mongoose.model('Sale').aggregate([
      { $match: { paymentMethod: 'cash' } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    // Get expenses
    const cashExpenses = await Expense.aggregate([
      { $match: { paymentMethod: 'cash' } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    // Calculate totals
    const totalInflows = cashInflows[0]?.total || 0;
    const totalExpenses = cashExpenses[0]?.total || 0;
    const currentBalance = (openingBalance?.amount || 0) + totalInflows - totalExpenses;

    res.json({
      openingBalance: openingBalance?.amount || 0,
      inflows: totalInflows,
      expenses: totalExpenses,
      currentBalance,
      lastUpdated: new Date()
    });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Set opening balance
router.post('/opening', async (req, res) => {
  try {
    const newBalance = new OpeningBalance({
      amount: req.body.amount,
      description: req.body.description
    });
    const savedBalance = await newBalance.save();
    res.status(201).json(savedBalance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;