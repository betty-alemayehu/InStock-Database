import * as warehouseController from "../controllers/warehouse-controller.js";

import express from "express";
const router = express.Router();

// GET - Hit this route on "warehouses"
router.route("/").get(warehouseController.index);
// GET - Hit this route on "warehouses/:id"
router.route("/:id").get(warehouseController.findOne);
//POST - Add warehouse
router.route("/add").post(warehouseController.createWarehouse);

export default router;
