import * as warehouseController from "../controllers/warehouse-controller.js";

import express from "express";
const router = express.Router();

// GET - Hit this route on "warehouses"
router
  .route("/")
  .get(warehouseController.index)
  .post(warehouseController.createWarehouse);

// GET - Hit this route on "warehouses/:id"
router
  .route("/:id")
  .get(warehouseController.findOne)
  .delete(warehouseController.deleteWarehouse);

//To get inventories for a specific warehouse
router.route("/:id/inventories").get(warehouseController.getInventory);

export default router;
