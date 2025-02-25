import mongoose from 'mongoose'
import KPMG from '../models/Kpmg.js';

// Get all
const getAll = async (req, res) => {
    const expense = await KPMG.find({}).sort({createdAt: -1})
    res.status(200).json(expense)
};

// Get a single
const get = async (req, res) => {
    const { id } = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({error: "No Expense Found"})
    }
    const expense = await KPMG.findById({_id: id})
    if(!expense){
        return res.status(400).json({error: "No Expense Found"})
    }
    res.status(200).json(expense)
};

// Create 
const create = async (req, res) => {
    const { description, amount } = req.body;
    try {
        const expense = await KPMG.create({description, amount})
        res.status(200).json(expense)
    } catch (error) {
        res.status(400).json({error: error.message})        
    }
};

// Delete 
const parnoid = async (req, res) => {
    const { id } = req.params;
    
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({error: "No Expense Found"})
    }

    const expense = await KPMG.findByIdAndDelete({_id: id})
    if(!expense){
        return res.status(400).json({error: "No Expense Found"})
    }

    res.status(200).json(expense)
};

//Update
const update = async (req, res) => {
    try {
        const { id } = req.params;
        const { description, amount } = req.body;
        const expense = await KPMG.findByIdAndUpdate({_id: id}, {
            description,
            amount
        });
        return res.status(200).json(expense)        
    } catch (error) {
        return res.status(400).json({error: error.message})        
    }
};

//getMonthly
const getMonthly = async (req, res) => {
    const { year, month } = req.params;

    // Validate year and month
    if (!year || !month || isNaN(year) || isNaN(month)) {
        return res.status(400).json({ error: "Invalid year or month" });
    }

    try {
        const startDate = new Date(year, month - 1, 1); // First day of the month
        const endDate = new Date(year, month, 0); // Last day of the month

        const expense = await KPMG.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: startDate,
                        $lte: endDate
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: 1 },
                    totalAmount: { $sum: "$amount" }
                }
            }
        ]);

        if (expense.length === 0) {
            return res.status(200).json({ totalSales: 0, totalAmount: 0 });
        }

        res.status(200).json(expense[0]);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

//getDaily
const getDaily = async (req, res) => {
    const { year, month, day } = req.params;
    try {
        const startOfDay = new Date(year, month - 1, day, 0, 0, 0);
        const endOfDay = new Date(year, month - 1, day, 23, 59, 59);

        const expense = await KPMG.find({
            createdAt: { $gte: startOfDay, $lte: endOfDay }
        });

        const totalExpense = expense.length;
        const totalAmount = expense.reduce((sum, expense) => sum + expense.amount, 0);

        res.status(200).json({ totalExpense, totalAmount });
    } catch (error) {
        console.error("Error in getDailySales:", error);
        res.status(500).json({ error: error.message });
    }
};

export {getAll, get, create, parnoid, update, getMonthly, getDaily}