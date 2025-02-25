import express from "express";
import {getExpenses, getExpense, createExpense, deleteExpense, updateExpense, getMonthlyExpense, getDailyExpense} from "../controllers/expenseController.js";

const router = express.Router();

router.get("/", getExpenses);
router.get("/:id", getExpense);
router.post("/", createExpense);
router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense);
router.get("/:year/:month", getMonthlyExpense);
router.get("/:year/:month/:day", getDailyExpense);

export default router;
