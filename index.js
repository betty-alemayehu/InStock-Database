import express from "express";
import cors from "cors";
import "dotenv/config";

import warehouseRoutes from "./routes/warehouses-routes.js";

const app = express();
app.use(cors());
app.use(express.json());

// all warehouses routes
app.use("/warehouses", warehouseRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
