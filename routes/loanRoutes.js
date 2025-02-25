import express from "express";
import {getLoans, getLoan, createLoan, deleteLoan, updateLoan, getMonthlyLoan, getDailyLoan} from "../controllers/loanController.js";

const router = express.Router();

router.get("/", getLoans);
router.get("/:id", getLoan);
router.post("/", createLoan);
router.put("/:id", updateLoan);
router.delete("/:id", deleteLoan);
router.get("/:year/:month", getMonthlyLoan);
router.get("/:year/:month/:day", getDailyLoan);

export default router;
