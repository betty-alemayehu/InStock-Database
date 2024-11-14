import * as inventoryController from "../controllers/inventory-controller.js";

import express from "express";
const router = express.Router();

// GET - Hit this route on "inventories"
router.route("/").get(inventoryController.index);
// GET - Hit this route on "inventories/:id"
router.route("/:id").get(inventoryController.findOne);

//POST - Add inventory
router.route("/inventory/add").post(inventoryController.createInventoryItem);

// PUT - edit inventory item
router.route("/inventory/:id/edit").put(inventoryController.editInventoryItem);

export default router;
