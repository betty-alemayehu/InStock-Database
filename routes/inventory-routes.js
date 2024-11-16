import * as inventoryController from "../controllers/inventory-controller.js";

import express from "express";
const router = express.Router();

router
	.route("/")
	.get(inventoryController.index)
	.post(inventoryController.createInventoryItem);

router
	.route("/:id")
	.get(inventoryController.findOne)
	.put(inventoryController.editInventoryItem)
	.delete(inventoryController.removeInventoryItem);

export default router;
