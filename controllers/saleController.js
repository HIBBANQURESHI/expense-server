import mongoose from 'mongoose'
import Sale from '../models/Sale.js'

// Get all sales
const getSales = async (req, res) => {
    const sale = await Sale.find({}).sort({createdAt: -1})
    res.status(200).json(sale)
};

// Get a single sale
const getSale = async (req, res) => {
    const { id } = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({error: "No Sale Found"})
    }
    const sale = await Sale.findById({_id: id})
    if(!sale){
        return res.status(400).json({error: "No Sale Found"})
    }
    res.status(200).json(sale)
};

// Create Sale
const createSale = async (req, res) => {
    const { name, description, amount, date } = req.body;
    try {
        const sale = await Sale.create({name, description, amount, date})
        res.status(200).json(sale)
    } catch (error) {
        res.status(400).json({error: error.message})        
    }
};

// Delete Sale
const deleteSale = async (req, res) => {
    const { id } = req.params;
    
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({error: "No Sale Found"})
    }

    const sale = await Sale.findByIdAndDelete({_id: id})
    if(!sale){
        return res.status(400).json({error: "No Sale Found"})
    }

    res.status(200).json(sale)
};

//Update Sale
const updateSale = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, amount, date } = req.body;
        const sale = await Sale.findByIdAndUpdate({_id: id}, {
            name,
            description,
            amount,
            date
        });
        return res.status(200).json(sale)        
    } catch (error) {
        return res.status(400).json({error: error.message})        
    }
};

//getMonthlySales
const getMonthlySales = async (req, res) => {
    const { year, month } = req.params;

    // Validate year and month
    if (!year || !month || isNaN(year) || isNaN(month)) {
        return res.status(400).json({ error: "Invalid year or month" });
    }

    try {
        const startDate = new Date(year, month - 1, 1); // First day of the month
        const endDate = new Date(year, month, 0); // Last day of the month

        const sales = await Sale.aggregate([
            {
                $match: {
                    date: {
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

        if (sales.length === 0) {
            return res.status(200).json({ totalSales: 0, totalAmount: 0 });
        }

        res.status(200).json(sales[0]);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

//getDailySales
const getDailySales = async (req, res) => {
    const { year, month, day } = req.params;
    try {
        const startOfDay = new Date(year, month - 1, day, 0, 0, 0);
        const endOfDay = new Date(year, month - 1, day, 23, 59, 59);

        const sales = await Sale.find({
            date: { $gte: startOfDay, $lte: endOfDay }
        });

        const totalSales = sales.length;
        const totalAmount = sales.reduce((sum, sale) => sum + sale.amount, 0);

        res.status(200).json({ totalSales, totalAmount });
    } catch (error) {
        console.error("Error in getDailySales:", error);
        res.status(500).json({ error: error.message });
    }
};

export {getSales, getSale, createSale, deleteSale, updateSale, getMonthlySales, getDailySales}