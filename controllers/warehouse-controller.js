import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

// SLIDE 6: Read (GET) - Fetch All Warehouses from DB
const index = async (_req, res) => {
  try {
    // get data from knex db, table warehouses
    const data = await knex("warehouses");
    res.status(200).json(data);
  } catch (err) {
    res.status(400).send(`Error retrieving Warehouses: ${err}`);
  }
};

//POST - Add warehouse
const createWarehouse = async (req, res) => {
  const {
    warehouse_name,
    address,
    city,
    country,
    contact_name,
    contact_position,
    contact_phone,
    contact_email,
  } = req.body;

  try {
    const [newWarehouse] = await knex("warehouses")
      .insert({
        warehouse_name,
        address,
        city,
        country,
        contact_name,
        contact_position,
        contact_phone,
        contact_email,
      })
      .returning("*");

    res.status(201).json(newWarehouse);
  } catch (err) {
    res.status(400).send(`Error creating warehouse: ${err}`);
  }
};

export { index, createWarehouse };
