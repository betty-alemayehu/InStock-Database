import * as warehouseController from "../controllers/warehouse-controller.js";

import express from "express";
const router = express.Router();

// Hit this route on "warehouses"
router.route("/").get(warehouseController.index);

//POST - Add warehouse
router.route("/add").post(warehouseController.createWarehouse);
// Hit this route on "warehouses/:id"
router.route("/:id").get(warehouseController.findOne);

//To get inventories for a specific warehouse
router.route("/:id/inventories").get(warehouseController.getInventory);

export default router;
