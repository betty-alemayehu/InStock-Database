import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

// SLIDE 6: Read (GET) - Fetch All Warehouses from DB
// returns all warehouses, building the SQL query SELECT * FROM warehouses
const index = async (_req, res) => {
  try {
    // get data from knex db, table warehouses
    const data = await knex("warehouses");
    res.status(200).json(data);
  } catch (err) {
    res.status(400).send(`Error retrieving Warehouses: ${err}`);
  }
};

// returns a single warehouse, building the SQL query SELECT * FROM warehouses WHERE id=#, where # is our parameter at req.params.id.
const findOne = async (req, res) => {
  try {
    const warehouseFound = await knex("warehouses").where({
      id: req.params.id,
    });

    if (warehouseFound.length === 0) {
      return res.status(404).json({
        message: `Warehouses with ID ${req.params.id} not found`,
      });
    }
    // Check warehouse
    console.log(warehouseFound);
    const warehouseData = warehouseFound[0];
    res.json(warehouseData);
  } catch (error) {
    res.status(500).json({
      message: `Unable to retrieve warehouse data for warehouse with ID ${req.params.id}`,
    });
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

  // Basic validation checks
  if (
    !warehouse_name?.trim() ||
    !address?.trim() ||
    !city?.trim() ||
    !country?.trim() ||
    !contact_name?.trim() ||
    !contact_position?.trim() ||
    !contact_phone?.trim() ||
    !contact_email?.trim() ||
    !/^\d{11}$/.test(contact_phone.replace(/\D/g, "")) || // Check for 11 digits
    !contact_email.includes("@") // Check for @ symbol
  ) {
    return res.status(400).json({
      message:
        "Invalid or missing data in request body, check for @ in email and only 10 numbers in phone field.",
    });
  }

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

export { index, findOne, createWarehouse };
