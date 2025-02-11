import express from "express";
import {getExpenses, getExpense, createExpense, deleteExpense, updateExpense} from "../controllers/expenseController.js";

const router = express.Router();

router.get("/", getExpenses);
router.get("/:id", getExpense);
router.post("/", createExpense);
router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense);

export default router;
