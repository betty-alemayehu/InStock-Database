import * as warehouseController from "../controllers/warehouse-controller.js";

import express from "express";
const router = express.Router();

// Hit this route on "warehouses"
router.route("/").get(warehouseController.index);

// Hit this route on "warehouses/:id"
router.route("/:id").get(warehouseController.findOne);

export default router;
