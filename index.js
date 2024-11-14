import express from "express";
import cors from "cors";
import "dotenv/config";

import warehouseRoutes from "./routes/warehouse-routes.js";
import inventoryRoutes from "./routes/inventory-routes.js";

const app = express();
app.use(cors());
app.use(express.json());

// all warehouses routes
app.use("/warehouses", warehouseRoutes);

// all inventories routes
app.use("/inventories", inventoryRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
