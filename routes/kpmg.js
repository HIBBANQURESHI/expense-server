import express from "express";
import {getLoans, getLoan, createLoan, deleteLoan, updateLoan, getMonthlyLoan, getDailyLoan, getLoanSummary} from "../controllers/kpmgController.js";

const router = express.Router();

router.get("/summary/total", getLoanSummary);
router.get("/", getLoans);
router.get("/:id", getLoan);
router.post("/", createLoan);
router.delete("/:id", deleteLoan);
router.put("/:id", updateLoan);
router.get("/:year/:month", getMonthlyLoan);
router.get("/:year/:month/:day", getDailyLoan);


export default router;
