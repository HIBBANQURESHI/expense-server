import mongoose from 'mongoose'
import Expense from '../models/Expense.js';

// Get all Expense
const getExpenses = async (req, res) => {
    const expense = await Expense.find({}).sort({createdAt: -1})
    res.status(200).json(expense)
};

// Get a single Expense
const getExpense = async (req, res) => {
    const { id } = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({error: "No Expense Found"})
    }
    const expense = await Expense.findById({_id: id})
    if(!expense){
        return res.status(400).json({error: "No Expense Found"})
    }
    res.status(200).json(expense)
};

// Create Expense
const createExpense = async (req, res) => {
    const { name, description, amount, date, paymentMethod } = req.body;
    try {
        const expense = await Expense.create({name, description, amount, date, paymentMethod})
        res.status(200).json(expense)
    } catch (error) {
        res.status(400).json({error: error.message})        
    }
};

// Delete Expense
const deleteExpense = async (req, res) => {
    const { id } = req.params;
    
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({error: "No Expense Found"})
    }

    const expense = await Expense.findByIdAndDelete({_id: id})
    if(!expense){
        return res.status(400).json({error: "No Expense Found"})
    }

    res.status(200).json(expense)
};

//Update Expense
const updateExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, amount, date, paymentMethod } = req.body;
        const expense = await Expense.findByIdAndUpdate({_id: id}, {
            name,
            description,
            amount,
            date,
            paymentMethod
        });
        return res.status(200).json(expense)        
    } catch (error) {
        return res.status(400).json({error: error.message})        
    }
};

//getMonthlySales
const getMonthlyExpense = async (req, res) => {
    const { year, month } = req.params;

    try {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        const summary = await Expense.aggregate([
            {
                $match: {
                    date: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: "$paymentMethod",
                    total: { $sum: "$amount" },
                    count: { $sum: 1 }
                }
            }
        ]);

        const result = {
            cash: summary.find(item => item._id === 'cash')?.total || 0,
            card: summary.find(item => item._id === 'card')?.total || 0,
            total: summary.reduce((acc, curr) => acc + curr.total, 0)
        };

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//getDailySales
const getDailyExpense = async (req, res) => {
    const { year, month, day } = req.params;

    try {
        const targetDate = new Date(year, month - 1, day);
        const startDate = new Date(targetDate.setHours(0, 0, 0, 0));
        const endDate = new Date(targetDate.setHours(23, 59, 59, 999));

        const summary = await Expense.aggregate([
            {
                $match: {
                    date: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: "$paymentMethod",
                    total: { $sum: "$amount" },
                    count: { $sum: 1 }
                }
            }
        ]);

        const result = {
            cash: summary.find(item => item._id === 'cash')?.total || 0,
            card: summary.find(item => item._id === 'card')?.total || 0,
            total: summary.reduce((acc, curr) => acc + curr.total, 0)
        };

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export {getExpenses, getExpense, createExpense, deleteExpense, updateExpense, getMonthlyExpense, getDailyExpense}