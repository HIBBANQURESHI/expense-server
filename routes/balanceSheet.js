import express from 'express';
import mongoose from 'mongoose';
import OpeningBalance from '../models/OpeningBalance.js';
import Expense from '../models/Expense.js';
import Loans from '../models/Loans.js';
import Receiving from '../models/Receiving.js';
import Sale from '../models/Sale.js';
import KeetaDelivery from '../models/KeetaDelivery.js';
import Hunger from '../models/Hunger.js';
import Noon from '../models/Noon.js';
import Jahez from '../models/Jahez.js';
import Marsool from '../models/Marsool.js';
import Ninja from '../models/Ninja.js';
import Brooze from '../models/Brooze.js';
import Kpmg from '../models/Kpmg.js';

const router = express.Router();

const getDeductions = async (startOfDay, endOfDay) => {
  const [deliveries, companies] = await Promise.all([
    Promise.all([
      KeetaDelivery.find({ date: { $gte: startOfDay, $lte: endOfDay } }),
      Hunger.find({ date: { $gte: startOfDay, $lte: endOfDay } }),
      Noon.find({ date: { $gte: startOfDay, $lte: endOfDay } }),
      Jahez.find({ date: { $gte: startOfDay, $lte: endOfDay } }),
      Marsool.find({ date: { $gte: startOfDay, $lte: endOfDay } }),
      Ninja.find({ date: { $gte: startOfDay, $lte: endOfDay } })
    ]),
    Promise.all([
      Brooze.find({ date: { $gte: startOfDay, $lte: endOfDay } }),
      Kpmg.find({ date: { $gte: startOfDay, $lte: endOfDay } })
    ])
  ]);

  return {
    deliveries: deliveries.reduce((acc, curr, index) => {
      const services = ['Keeta', 'Hunger', 'Noon', 'Jahez', 'Marsool', 'Ninja'];
      acc[services[index]] = curr.reduce((sum, item) => sum + (item.amount || 0), 0);
      return acc;
    }, {}),
    companies: {
      Brooze: companies[0].reduce((sum, item) => sum + (item.amount || 0), 0),
      Kpmg: companies[1].reduce((sum, item) => sum + (item.amount || 0), 0)
    }
  };
};

router.get('/', async (req, res) => {
  try {
    const date = req.query.date ? new Date(req.query.date) : new Date();
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const openingEntry = await OpeningBalance.findOne({ date: { $gte: startOfDay, $lte: endOfDay } });
    let openingBalance = openingEntry?.amount || 0;

    if (!openingEntry) {
      const prevDay = await OpeningBalance.findOne({ date: { $lt: startOfDay } }).sort({ date: -1 });
      openingBalance = prevDay?.amount || 0;
    }

    const [cashSales, cashExpenses, loans, receivings, deductions] = await Promise.all([
      Sale.aggregate([{ $match: { paymentMethod: 'cash', date: { $gte: startOfDay, $lte: endOfDay } } }, { $group: { _id: null, total: { $sum: "$amount" } } }]),
      Expense.aggregate([{ $match: { paymentMethod: 'cash', date: { $gte: startOfDay, $lte: endOfDay } } }, { $group: { _id: null, total: { $sum: "$amount" } } }]),
      Loans.find({ date: { $gte: startOfDay, $lte: endOfDay } }),
      Receiving.find({ date: { $gte: startOfDay, $lte: endOfDay } }),
      getDeductions(startOfDay, endOfDay)
    ]);

    const totalInflows = cashSales[0]?.total || 0;
    const totalExpenses = cashExpenses[0]?.total || 0;
    const totalLoans = loans.reduce((sum, loan) => sum + (loan.remaining || 0), 0);
    const totalReceivings = receivings.reduce((sum, r) => sum + (r.amount || 0), 0);
    const totalDeliveries = Object.values(deductions.deliveries).reduce((a, b) => a + b, 0);
    const totalCompanies = Object.values(deductions.companies).reduce((a, b) => a + b, 0);

    const currentBalance = openingBalance + totalInflows - totalExpenses - totalLoans - totalReceivings - totalDeliveries - totalCompanies;

    const nextDay = new Date(startOfDay);
    nextDay.setDate(nextDay.getDate() + 1);
    if (!await OpeningBalance.findOne({ date: { $gte: nextDay, $lte: nextDay } })) {
      await OpeningBalance.create({ amount: currentBalance, date: nextDay });
    }

    res.json({
      openingBalance,
      inflows: totalInflows,
      expenses: totalExpenses,
      loans: totalLoans,
      receivings: totalReceivings,
      deliveries: deductions.deliveries,
      companies: deductions.companies,
      currentBalance,
      nextDayOpening: currentBalance
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/opening', async (req, res) => {
  try {
    const newBalance = new OpeningBalance({
      amount: req.body.amount,
      date: req.body.date,
      description: 'Manual entry'
    });
    const savedBalance = await newBalance.save();
    res.status(201).json(savedBalance);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.patch('/:model/:id', async (req, res) => {
  try {
    const modelMap = {
      keeta: KeetaDelivery, hunger: Hunger, noon: Noon, jahez: Jahez,
      marsool: Marsool, ninja: Ninja, loan: Loans, expense: Expense,
      receiving: Receiving, sale: Sale, brooze: Brooze, kpmg: Kpmg
    };

    const modelName = req.params.model.toLowerCase();
    const model = modelMap[modelName];
    if (!model) return res.status(404).json({ error: 'Model not found' });

    const updatedDoc = await model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedDoc) return res.status(404).json({ error: 'Document not found' });

    res.json({ message: 'Update successful', updated: updatedDoc });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;