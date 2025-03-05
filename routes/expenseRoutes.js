import express from "express";
import {getExpenses, getExpense, createExpense, deleteExpense, updateExpense, getMonthlyExpense, getDailyExpense} from "../controllers/expenseController.js";

const router = express.Router();

router.get("/", getExpenses);
router.get("/:id", getExpense);
router.post("/", createExpense);
router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense);
router.get("/monthly-summary/:year/:month", getMonthlyExpense);
router.get("/daily-summary/:year/:month/:day", getDailyExpense);

export default router;
