import * as warehouseController from "../controllers/warehouse-controller.js";

import express from "express";
const router = express.Router();

router.route("/").get(warehouseController.index);

export default router;
