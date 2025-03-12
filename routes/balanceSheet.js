import express from 'express';
import mongoose from 'mongoose';
import OpeningBalance from '../models/OpeningBalance.js';
import Expense from '../models/Expense.js';
import Loans from '../models/Loans.js';
import Receiving from '../models/Receiving.js';
import Sale from '../models/Sale.js';
import KeetaDelivery from '../models/KeetaDelivery.js';
import HungerDelivery from '../models/HungerDelivery.js';
import NoonDelivery from '../models/NoonDelivery.js';
import JahezDelivery from '../models/JahezDelivery.js';
import MarsoolDelivery from '../models/MarsoolDelivery.js';
import NinjaDelivery from '../models/NinjaDelivery.js';

const router = express.Router();

const getDeliveryDeductions = async (startOfDay, endOfDay) => {
  try {
    const deliveries = await Promise.all([
      KeetaDelivery.find({ date: { $gte: startOfDay, $lte: endOfDay } }),
      HungerDelivery.find({ date: { $gte: startOfDay, $lte: endOfDay } }),
      NoonDelivery.find({ date: { $gte: startOfDay, $lte: endOfDay } }),
      JahezDelivery.find({ date: { $gte: startOfDay, $lte: endOfDay } }),
      MarsoolDelivery.find({ date: { $gte: startOfDay, $lte: endOfDay } }),
      NinjaDelivery.find({ date: { $gte: startOfDay, $lte: endOfDay } })
    ]);

    return deliveries.reduce((acc, curr, index) => {
      const services = ['Keeta', 'Hunger', 'Noon', 'Jahez', 'Marsool', 'Ninja'];
      acc[services[index]] = curr.reduce((sum, item) => sum + (item.amount || 0), 0);
      return acc;
    }, {});
  } catch (error) {
    console.error('Error fetching deliveries:', error);
    return {};
  }
};

router.get('/', async (req, res) => {
  try {
    const date = req.query.date ? new Date(req.query.date) : new Date();
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Get previous balance
    const prevOpening = await OpeningBalance.findOne({
      date: { $lt: startOfDay }
    }).sort({ date: -1 });

    // Get transactions
    // Fix the Loans and Receiving queries by removing trailing commas
const [cashSales, cashExpenses, loans, receivings, deliveryDeductions] = await Promise.all([
    Sale.aggregate([
      { 
        $match: { 
          paymentMethod: 'cash',
          date: { $gte: startOfDay, $lte: endOfDay }
        }
      },
      { 
        $group: { 
          _id: null, 
          total: { $sum: "$amount" } 
        } 
      }
    ]),
    Expense.aggregate([
      { 
        $match: { 
          paymentMethod: 'cash',
          date: { $gte: startOfDay, $lte: endOfDay }
        }
      },
      { 
        $group: { 
          _id: null, 
          total: { $sum: "$amount" } 
        } 
      }
    ]),
    Loans.find({ date: { $gte: startOfDay, $lte: endOfDay } }),  // Fixed
    Receiving.find({ date: { $gte: startOfDay, $lte: endOfDay } }),  // Fixed
    getDeliveryDeductions(startOfDay, endOfDay)
  ]);

    // Calculate totals
    const totalInflows = cashSales[0]?.total || 0;
    const totalExpenses = cashExpenses[0]?.total || 0;
    const totalLoans = loans.reduce((sum, loan) => sum + (loan.remaining || 0), 0);
    const totalReceivings = receivings.reduce((sum, r) => sum + (r.amount || 0), 0);
    const totalDeliveries = Object.values(deliveryDeductions).reduce((a, b) => a + b, 0);

    const currentBalance = (prevOpening?.amount || 0) + 
                         totalInflows - 
                         totalExpenses - 
                         totalLoans - 
                         totalReceivings - 
                         totalDeliveries;

    // Save next day's opening
    if (!await OpeningBalance.findOne({ date: endOfDay })) {
      await OpeningBalance.create({
        amount: currentBalance,
        date: endOfDay,
        description: 'Auto-generated daily balance'
      });
    }

    res.json({
      openingBalance: prevOpening?.amount || 0,
      inflows: totalInflows,
      expenses: totalExpenses,
      loans: totalLoans,
      receivings: totalReceivings,
      deliveries: deliveryDeductions,
      currentBalance,
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in balance route:', error);
    res.status(500).json({ 
      error: 'Failed to fetch balance data',
      details: error.message 
    });
  }
});

// Generic update endpoint
router.patch('/:model/:id', async (req, res) => {
  try {
    const modelMap = {
      'keeta': KeetaDelivery,
      'hunger': HungerDelivery,
      'noon': NoonDelivery,
      'jahez': JahezDelivery,
      'marsool': MarsoolDelivery,
      'ninja': NinjaDelivery,
      'loan': Loans,
      'expense': Expense,
      'receiving': Receiving,
      'sale': Sale,
      'openingbalance': OpeningBalance
    };

    const modelName = req.params.model.toLowerCase();
    const model = modelMap[modelName];
    
    if (!model) {
      return res.status(404).json({ 
        error: 'Model not found',
        availableModels: Object.keys(modelMap)
      });
    }

    const updatedDoc = await model.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedDoc) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.json({
      message: 'Update successful',
      model: modelName,
      updated: updatedDoc
    });

  } catch (error) {
    console.error('Update error:', error);
    res.status(400).json({ 
      error: 'Update failed',
      details: error.message 
    });
  }
});

export default router;