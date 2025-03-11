import mongoose from 'mongoose'
import Sale from '../models/Sale.js'

// Get all sales
const getSales = async (req, res) => {
    const sale = await Sale.find({}).sort({createdAt: -1})
    res.status(200).json(sale)
};

// Get a single sale
const getSale = async (req, res) => {
    try {
        const { id } = req.params;
        const decodedId = decodeURIComponent(id);
        
        if (!mongoose.Types.ObjectId.isValid(decodedId)) {
            return res.status(400).json({
                success: false,
                error: "Invalid ID format"
            });
        }

        const sale = await Sale.findById(decodedId);
        if (!sale) {
            return res.status(404).json({
                success: false,
                error: "Sale not found"
            });
        }

        res.status(200).json({
            success: true,
            data: {
                ...sale._doc,
                date: sale.date.toISOString()
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Server error"
        });
    }
};

// Create Sale
const createSale = async (req, res) => {
    const { name, description, amount, date, paymentMethod } = req.body;
    try {
        const sale = await Sale.create({name, description, amount, date, paymentMethod})
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
        const decodedId = decodeURIComponent(id);

        if (!mongoose.Types.ObjectId.isValid(decodedId)) {
            return res.status(400).json({
                success: false,
                error: "Invalid ID format"
            });
        }

        const updatedSale = await Sale.findByIdAndUpdate(
            decodedId,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedSale) {
            return res.status(404).json({
                success: false,
                error: "Sale not found"
            });
        }

        res.status(200).json({
            success: true,
            data: updatedSale
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

//getMonthlySales
const getMonthlySales = async (req, res) => {
    const { year, month } = req.params;
    try {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        const salesData = await Sale.aggregate([
            {
                $match: {
                    date: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: 1 },
                    totalAmount: { $sum: "$amount" },
                    cashSales: {
                        $sum: {
                            $cond: [{ $eq: ["$paymentMethod", "cash"] }, 1, 0]
                        }
                    },
                    cardSales: {
                        $sum: {
                            $cond: [{ $eq: ["$paymentMethod", "card"] }, 1, 0]
                        }
                    },
                    cashAmount: {
                        $sum: {
                            $cond: [{ $eq: ["$paymentMethod", "cash"] }, "$amount", 0]
                        }
                    },
                    cardAmount: {
                        $sum: {
                            $cond: [{ $eq: ["$paymentMethod", "card"] }, "$amount", 0]
                        }
                    }
                }
            }
        ]);

        const result = salesData.length > 0 ? salesData[0] : { 
            totalSales: 0,
            totalAmount: 0,
            cashSales: 0,
            cardSales: 0,
            cashAmount: 0,
            cardAmount: 0
        };

        res.status(200).json(result);
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

const getTotalRevenue = async (req, res) => {
    try {
        const result = await Sale.aggregate([
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$amount" },
                    totalSales: { $sum: 1 }
                }
            }
        ]);

        // Return proper structure even when no sales exist
        res.status(200).json({
            totalAmount: result[0]?.totalAmount || 0,
            totalSales: result[0]?.totalSales || 0
        });
        
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};



export {getSales, getSale, createSale, deleteSale, updateSale, getMonthlySales, getDailySales, getTotalRevenue}