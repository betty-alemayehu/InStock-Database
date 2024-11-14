import * as inventoryController from "../controllers/inventory-controller.js";

import express from "express";
const router = express.Router();

// GET - Hit this route on "inventories"
router
  .route("/")
  .get(inventoryController.index)
  .post(inventoryController.createInventoryItem);
// GET - Hit this route on "inventories/:id"
router
  .route("/:id")
  .get(inventoryController.findOne)
  .put(inventoryController.editInventoryItem)
  .delete(inventoryController.removeInventoryItem);

export default router;
