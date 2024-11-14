import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

const index = async (_req, res) => {
  try {
    // get data from knex db, table inventories
    // inventories db doesn't have warehouse_name, need to join to access warehouse_name
    const data = await knex("inventories")
      .join("warehouses", "inventories.warehouse_id", "warehouses.id")
      .select(
        "inventories.id",
        "warehouses.warehouse_name",
        "inventories.item_name",
        "inventories.description",
        "inventories.category",
        "inventories.status",
        "inventories.quantity"
      );
    res.status(200).json(data);
  } catch (err) {
    res.status(500).send(`Error retrieving inventories: ${err}`);
  }
};

// returns a single inventory item, building the SQL query SELECT * FROM inventories WHERE id=#, where # is our parameter at req.params.id.
const findOne = async (req, res) => {
  try {
    // Join inventories with warehouses using warehouse_id
    const inventoryItemFound = await knex("inventories")
      .join("warehouses", "inventories.warehouse_id", "warehouses.id")
      .where("inventories.id", req.params.id)
      .select(
        "inventories.id",
        "warehouses.warehouse_name",
        "inventories.item_name",
        "inventories.description",
        "inventories.category",
        "inventories.status",
        "inventories.quantity"
      );

    // Response returns 404 if the ID is not found
    if (inventoryItemFound.length === 0) {
      return res.status(404).json({
        message: `Inventory item with ID ${req.params.id} not found`,
      });
    }
    // Check inventory item
    console.log(inventoryItemFound);
    const inventoryItemData = inventoryItemFound[0];

    // Response returns 200 if successful
    res.json(inventoryItemData);
  } catch (error) {
    res.status(500).json({
      message: `Unable to retrieve inventory data for inventory with ID ${req.params.id}`,
    });
  }
};

const createInventoryItem = async (req, res) => {
  const { warehouse_id, item_name, description, category, status } = req.body;
  const quantity = Number(req.body.quantity);

  // Basic validation checks
  if (
    !warehouse_id ||
    !item_name?.trim() ||
    !description?.trim() ||
    !category ||
    !status ||
    quantity === undefined ||
    !["In Stock", "Out of Stock"].includes(status) ||
    isNaN(quantity)
  ) {
    return res.status(400).json({
      message:
        "Invalid or missing data in request body. Ensure all fields are correctly entered, status is either 'In Stock' or 'Out of Stock', and quantity is a number value.",
    });
  }

  try {
    const warehouseExists = await knex("warehouses")
      .select("id")
      .where("id", warehouse_id)
      .first();

    if (!warehouseExists) {
      return res.status(400).json({ message: "Invalid warehouse_id" });
    }

    const newItem = {
      warehouse_id,
      item_name,
      description,
      category,
      status,
      quantity,
    };

    const [newInventoryItemId] = await knex("inventories")
      .insert(newItem)
      .returning("*");

    res.status(201).json({ id: newInventoryItemId, ...newItem });
  } catch (error) {
    res.status(500).send(`Error creating inventory item: ${error}`);
  }
};

const editInventoryItem = async (req, res) => {
  const { id } = req.params;
  const { warehouse_id, item_name, description, category, status } = req.body;
  const quantity = Number(req.body.quantity);

  // Basic validation checks
  if (
    !warehouse_id ||
    !item_name?.trim() ||
    !description?.trim() ||
    !category ||
    !status ||
    quantity === undefined ||
    !["In Stock", "Out of Stock"].includes(status) ||
    isNaN(quantity)
  ) {
    return res.status(400).json({
      message:
        "Invalid or missing data in request body. Ensure all fields are correctly entered, status is either 'In Stock' or 'Out of Stock', and quantity is a number value.",
    });
  }

  try {
    const warehouseExists = await knex("warehouses")
      .select("id")
      .where("id", warehouse_id)
      .first();

    if (!warehouseExists) {
      return res.status(400).json({ message: "Invalid warehouse_id" });
    }

    const inventoryItemExists = await knex("inventories")
      .select("id")
      .where("id", id)
      .first();

    if (!inventoryItemExists) {
      return res
        .status(404)
        .json({ message: `Inventory item with ID ${id} not found.` });
    }

    const updatedItem = {
      warehouse_id,
      item_name,
      description,
      category,
      status,
      quantity,
    };

    await knex("inventories").where("id", id).update(updatedItem);

    const updatedInventoryItem = await knex("inventories")
      .select("*")
      .where("id", id)
      .first();

    res.status(200).json({ ...updatedInventoryItem });
  } catch (error) {
    res.status(500).send(`Error editing inventory item: ${error}`);
  }
};

const removeInventoryItem = async (req, res) => {
  try {
    const itemDeleted = await knex("inventories")
      .where({ id: req.params.id })
      .delete();

    if (!itemDeleted) {
      return res
        .status(404)
        .json({ message: `Inventory item with ID ${req.params.id} not found` });
    }

    // No Content response
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({
      message: `Unable to delete inventory item: ${error.message}`,
    });
  }
};

export {
  index,
  findOne,
  createInventoryItem,
  editInventoryItem,
  removeInventoryItem,
};
