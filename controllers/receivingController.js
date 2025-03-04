import mongoose from 'mongoose'
import Receiving from '../models/Receiving.js';

// Get all Loan
const getLoans = async (req, res) => {
    const loan = await Receiving.find({}).sort({createdAt: -1})
    res.status(200).json(loan)
};

// Get a single Loan
const getLoan = async (req, res) => {
    const { id } = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({error: "No Loan Found"})
    }
    const loan = await Receiving.findById({_id: id})
    if(!loan){
        return res.status(400).json({error: "No Loan Found"})
    }
    res.status(200).json(loan)
};

// Create Loan
const createLoan = async (req, res) => {
    const { name, amount, date } = req.body;
    try {
        const loan = await Receiving.create({name, amount, date: date ? new Date(date) : new Date()})
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

    const loan = await Receiving.findByIdAndDelete({_id: id})
    if(!loan){
        return res.status(400).json({error: "No Loan Found"})
    }

    res.status(200).json(loan)
};

//Update Loan
const updateLoan = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, amount, date } = req.body;
        const loan = await Receiving.findByIdAndUpdate({_id: id}, {
            name,
            amount,
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

        const sales = await Receiving.find({
            date: { $gte: startDate, $lte: endDate }
        }).select("name date amount");

        res.status(200).json(sales);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

//getDailyLoan
const getDailyLoan = async (req, res) => {
    const { year, month, day } = req.params;

    try {
        const startOfDay = new Date(year, month - 1, day);
        const endOfDay = new Date(year, month - 1, day + 1);
        
        const sales = await Receiving.find({
            date: { $gte: startOfDay, $lt: endOfDay }
        }).select("name date amount");
        

        res.status(200).json(sales);
    } catch (error) {
        console.error("Error in getDailyLoan:", error);
        res.status(500).json({ error: error.message });
    }
};


export {getLoans, getLoan, createLoan, deleteLoan, updateLoan, getMonthlyLoan, getDailyLoan}