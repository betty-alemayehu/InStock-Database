import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

const index = async (_req, res) => {
  try {
    // get data from knex db, table inventories
    const data = await knex("inventories");
    res.status(200).json(data);
  } catch (err) {
    res.status(400).send(`Error retrieving inventories: ${err}`);
  }
};

// returns a single inventory item, building the SQL query SELECT * FROM inventories WHERE id=#, where # is our parameter at req.params.id.
const findOne = async (req, res) => {
  try {
    const inventoryItemFound = await knex("inventories").where({
      id: req.params.id,
    });

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

export { index, findOne };
