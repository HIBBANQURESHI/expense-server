import express from "express";
import {getAll, get, create, parnoid, update, getMonthly, getDaily} from "../controllers/kpmgController.js";

const router = express.Router();

router.get("/", getAll);
router.get("/:id", get);
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", parnoid);
router.get("/:year/:month", getMonthly);
router.get("/:year/:month/:day", getDaily);

export default router;
