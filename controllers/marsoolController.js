import mongoose from 'mongoose'
import Marsool from '../models/Marsool.js'

// Get all deliverys
const getDeliveries = async (req, res) => {
    const delivery = await Marsool.find({}).sort({createdAt: -1})
    res.status(200).json(delivery)
};

// Get a single delivery
const getDelivery = async (req, res) => {
    const { id } = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({error: "No Delivery Found"})
    }
    const delivery = await Marsool.findById({_id: id})
    if(!delivery){
        return res.status(400).json({error: "No Delivery Found"})
    }
    res.status(200).json(delivery)
};

// Create Delivery
const createDelivery = async (req, res) => {
    const { deliveries, amount, paidAmount, date } = req.body;
    try {
        const balance = amount - (paidAmount || 0);
        const delivery = await Marsool.create({ 
            deliveries, 
            amount, 
            paidAmount: paidAmount || 0,
            balance,
            date 
        });
        res.status(200).json(delivery);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete Delivery
const deleteDelivery = async (req, res) => {
    const { id } = req.params;
    
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({error: "No Delivery Found"})
    }

    const delivery = await Marsool.findByIdAndDelete({_id: id})
    if(!delivery){
        return res.status(400).json({error: "No Delivery Found"})
    }

    res.status(200).json(delivery)
};

//Update Delivery
const updateDelivery = async (req, res) => {
    try {
        const { id } = req.params;
        const { deliveries, amount, paidAmount, date } = req.body;
        const balance = amount - (paidAmount || 0);
        
        const delivery = await Marsool.findByIdAndUpdate(id, {
            deliveries,
            amount,
            paidAmount: paidAmount || 0,
            balance,
            date
        }, { new: true });
        
        res.status(200).json(delivery);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get Summary
const getDeliverySummary = async (req, res) => {
    try {
        const result = await Marsool.aggregate([
          {
            $group: {
              _id: null,
              totalDeliveries: { $sum: "$deliveries" },
              totalAmount: { $sum: "$amount" },
              totalPaid: { $sum: "$paidAmount" },
              totalBalance: { $sum: "$balance" }
            }
          }
        ]);
        
        res.status(200).json(result[0] || {
          totalDeliveries: 0,
          totalAmount: 0,
          totalPaid: 0,
          totalBalance: 0
        });
      } catch (error) {
        res.status(500).json({ error: "Could not calculate totals" });
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

        const expense = await Marsool.aggregate([
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

        const expense = await Marsool.find({
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


export {getDeliveries, getDelivery, createDelivery, deleteDelivery, updateDelivery, getMonthly, getDaily, getDeliverySummary}