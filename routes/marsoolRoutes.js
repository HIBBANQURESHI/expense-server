import express from "express";
import {
    getDeliveries,
    getDelivery,
    createDelivery,
    deleteDelivery,
    updateDelivery,
    getMonthly,
    getDaily,
    getDeliverySummary
} from "../controllers/marsoolController.js";

const router = express.Router();

// Add summary route first
router.get("/summary/total", getDeliverySummary);
router.get("/", getDeliveries);
router.get("/:id", getDelivery);
router.post("/", createDelivery);
router.put("/:id", updateDelivery);
router.delete("/:id", deleteDelivery);
router.get("/:year/:month", getMonthly);
router.get("/:year/:month/:day", getDaily);

export default router;