import mongoose from 'mongoose'
import KPMG from '../models/Kpmg.js';

// Get all Loan
const getLoans = async (req, res) => {
    const loan = await KPMG.find({}).sort({createdAt: -1})
    res.status(200).json(loan)
};

// Get a single Loan
const getLoan = async (req, res) => {
    const { id } = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({error: "No Loan Found"})
    }
    const loan = await KPMG.findById({_id: id})
    if(!loan){
        return res.status(400).json({error: "No Loan Found"})
    }
    res.status(200).json(loan)
};

// Create Loan
const createLoan = async (req, res) => {
    const { name, amount, credit, balance, date } = req.body;
    try {
        const loan = await KPMG.create({name, amount, credit, balance, date: date ? new Date(date) : new Date()})
        res.status(200).json(loan)
    } catch (error) {
        res.status(400).json({error: error.message})        
    }
};

// Delete Loan
const deleteLoan = async (req, res) => {
    const { id } = req.params;
    
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({error: "No Loan Found"})
    }

    const loan = await KPMG.findByIdAndDelete({_id: id})
    if(!loan){
        return res.status(400).json({error: "No Loan Found"})
    }

    res.status(200).json(loan)
};

//Update Loan
const updateLoan = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, amount, credit, balance, date } = req.body;
        const loan = await KPMG.findByIdAndUpdate({_id: id}, {
            name,
            amount, 
            credit,
            balance,
            date: date ? new Date(date) : new Date()
        });
        return res.status(200).json(loan)        
    } catch (error) {
        return res.status(400).json({error: error.message})        
    }
};

//getMonthlyLoan
const getMonthlyLoan = async (req, res) => {
    const { year, month } = req.params;

    if (!year || !month || isNaN(year) || isNaN(month)) {
        return res.status(400).json({ error: "Invalid year or month" });
    }

    try {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        const sales = await KPMG.find({
            date: { $gte: startDate, $lte: endDate }
        }).select("name date amount credit balance");

        res.status(200).json(sales);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

//getDailyLoan
const getDailyLoan = async (req, res) => {
    const { year, month, day } = req.params;

    try {
        const startOfDay = new Date(year, month - 1, day, 0, 0, 0);
        const endOfDay = new Date(year, month - 1, day, 23, 59, 59);

        const sales = await KPMG.find({
            date: { $gte: startOfDay, $lte: endOfDay }
        }).select("name date amount credit balance");

        res.status(200).json(sales);
    } catch (error) {
        console.error("Error in getDailyLoan:", error);
        res.status(500).json({ error: error.message });
    }
};

const getLoanSummary = async (req, res) => {
    try {
      const summary = await KPMG.aggregate([
        {
          $group: {
            _id: null,
            totalAmount: { $sum: "$amount" },
            totalCredit: { $sum: "$credit" },
            totalBalance: { $sum: "$balance" },
            totalLoans: { $sum: 1 }
          }
        }
      ]);
      
      res.status(200).json(summary[0] || {
        totalAmount: 0,
        totalCredit: 0,
        totalBalance: 0,
        totalLoans: 0
      });
    } catch (error) {
      console.error("Error in getLoanSummary:", error);
      res.status(500).json({ error: "Failed to fetch loan summary" });
    }
};


export {getLoans, getLoan, createLoan, deleteLoan, updateLoan, getMonthlyLoan, getDailyLoan, getLoanSummary}