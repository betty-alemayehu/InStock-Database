import * as warehouseController from "../controllers/warehouse-controller.js";

import express from "express";
const router = express.Router();

router.route("/").get(warehouseController.index);

//POST - Add warehouse
router.route("/add").post(warehouseController.createWarehouse);

export default router;
