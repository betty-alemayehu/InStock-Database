import * as inventoryController from "../controllers/inventory-controller.js";

import express from "express";
const router = express.Router();

// GET - Hit this route on "inventories"
router
  .route("/")
  .get(inventoryController.index)
  .post(inventoryController.createInventoryItem);
// GET - Hit this route on "inventories/:id"
router.route("/:id").get(inventoryController.findOne);

// PUT - edit inventory item
router.route("/:id").put(inventoryController.editInventoryItem);

export default router;
