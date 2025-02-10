import express from "express";
import {getDeliveries, getDelivery, createDelivery, deleteDelivery, updateDelivery} from "../controllers/deliveryController.js";

const router = express.Router();

router.get("/", getDeliveries);
router.get("/:id", getDelivery);
router.post("/", createDelivery);
router.put("/:id", updateDelivery);
router.delete("/:id", deleteDelivery);

export default router;
