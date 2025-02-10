import express from "express";
import {getParcels, getParcel, createParcel, deleteParcel, updateParcel} from "../controllers/parcelController.js";

const router = express.Router();

router.get("/", getParcels);
router.get("/:id", getParcel);
router.post("/", createParcel);
router.put("/:id", deleteParcel);
router.delete("/:id", updateParcel);

export default router;
