import mongoose from 'mongoose'
import Delivery from '../models/KeetaDelivery.js'

// Get all deliverys
const getDeliveries = async (req, res) => {
    const delivery = await Delivery.find({}).sort({createdAt: -1})
    res.status(200).json(delivery)
};

// Get a single delivery
const getDelivery = async (req, res) => {
    const { id } = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({error: "No Delivery Found"})
    }
    const delivery = await Delivery.findById({_id: id})
    if(!delivery){
        return res.status(400).json({error: "No Delivery Found"})
    }
    res.status(200).json(delivery)
};

// Create Delivery
const createDelivery = async (req, res) => {
    const { deliveries, amount, date } = req.body;
    try {
        const delivery = await Delivery.create({deliveries, amount, date})
        res.status(200).json(delivery)
    } catch (error) {
        res.status(400).json({error: error.message})        
    }
};

// Delete Delivery
const deleteDelivery = async (req, res) => {
    const { id } = req.params;
    
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({error: "No Delivery Found"})
    }

    const delivery = await Delivery.findByIdAndDelete({_id: id})
    if(!delivery){
        return res.status(400).json({error: "No Delivery Found"})
    }

    res.status(200).json(delivery)
};

//Update Delivery
const updateDelivery = async (req, res) => {
    try {
        const { id } = req.params;
        const { deliveries, amount, date } = req.body;
        const delivery = await Delivery.findByIdAndUpdate({_id: id}, {
            deliveries,
            amount,
            date
        });
        return res.status(200).json(delivery)        
    } catch (error) {
        return res.status(400).json({error: error.message})        
    }
};

const getMonthly = async (req, res) => {
    const { year, month } = req.params;

    if (!year || !month || isNaN(year) || isNaN(month)) {
        return res.status(400).json({ error: "Invalid year or month" });
    }

    try {
        const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
        const endDate = new Date(Date.UTC(year, month, 1, 0, 0, 0));
        

        console.log("Start Date:", startDate);
        console.log("End Date:", endDate);

        const expense = await Delivery.aggregate([
            {
                $match: {
                    date: {
                        $gte: startDate,
                        $lt: endDate
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalDeliveries: { $sum: 1 },  
                    totalAmount: { $sum: "$amount" }
                }
            }
        ]);
        

        console.log("Monthly Deliveries Data:", expense); // Debugging

        if (expense.length === 0) {
            return res.status(200).json({ totalDeliveries: 0, totalAmount: 0 });
        }

        res.status(200).json(expense[0]);
    } catch (error) {
        console.error("Error in getMonthly:", error);
        res.status(400).json({ error: error.message });
    }
};


// getDaily Deliveries
const getDaily = async (req, res) => {
    const { year, month, day } = req.params;
    try {
        const startOfDay = new Date(year, month - 1, day, 0, 0, 0);
        const endOfDay = new Date(year, month - 1, day, 23, 59, 59);

        const expense = await Delivery.find({
            date: { $gte: startOfDay, $lte: endOfDay }
        });

        console.log("Daily Deliveries Data:", expense);  // Debugging

        const totalDeliveries = expense.length;  // FIXED: Renamed from totalExpense
        const totalAmount = expense.reduce((sum, expense) => sum + expense.amount, 0);

        res.status(200).json({ totalDeliveries, totalAmount });
    } catch (error) {
        console.error("Error in getDaily:", error);
        res.status(500).json({ error: error.message });
    }
};


export {getDeliveries, getDelivery, createDelivery, deleteDelivery, updateDelivery, getMonthly, getDaily}