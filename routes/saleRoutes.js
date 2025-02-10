import express from "express";
import {getSales, getSale, createSale, deleteSale, updateSale} from "../controllers/saleController.js";

const router = express.Router();

router.get("/", getSales);
router.get("/:id", getSale);
router.post("/", createSale);
router.put("/:id", updateSale);
router.delete("/:id", deleteSale);

export default router;
