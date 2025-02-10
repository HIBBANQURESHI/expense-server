import express from "express";
import {getLoans, getLoan, createLoan, deleteLoan, updateLoan} from "../controllers/loanController.js";

const router = express.Router();

router.get("/", getLoans);
router.get("/:id", getLoan);
router.post("/", createLoan);
router.put("/:id", deleteLoan);
router.delete("/:id", updateLoan);

export default router;
