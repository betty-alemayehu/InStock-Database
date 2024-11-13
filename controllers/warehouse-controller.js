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

export { index };
