import * as warehouseController from "../controllers/warehouse-controller.js";

import express from "express";
const router = express.Router();

router
	.route("/")
	.get(warehouseController.index)
	.post(warehouseController.createWarehouse);

router
	.route("/:id")
	.get(warehouseController.findOne)
	.delete(warehouseController.deleteWarehouse)
	.put(warehouseController.editWarehouse);

router.route("/:id/inventories").get(warehouseController.getInventory);

export default router;
