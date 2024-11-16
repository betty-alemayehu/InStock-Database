import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

// SLIDE 6: Read (GET) - Fetch All Warehouses from DB
// returns all warehouses, building the SQL query SELECT * FROM warehouses
const index = async (req, res) => {
	const { s } = req.query; // Retrieve search term from query parameters

	try {
		// Base query to fetch all warehouses
		const query = knex("warehouses").select(
			"id",
			"warehouse_name",
			"address",
			"city",
			"country",
			"contact_name",
			"contact_position",
			"contact_phone",
			"contact_email"
		);

		// If search term exists, filter the query
		if (s) {
			query.where(function () {
				this.where("warehouse_name", "like", `%${s}%`)
					.orWhere("address", "like", `%${s}%`)
					.orWhere("city", "like", `%${s}%`)
					.orWhere("country", "like", `%${s}%`)
					.orWhere("contact_name", "like", `%${s}%`);
			});
		}

		// Execute query and send the result
		const data = await query;
		res.status(200).json(data);
	} catch (err) {
		res.status(500).send(`Error retrieving warehouses: ${err}`);
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
		const newWarehouse = {
			warehouse_name,
			address,
			city,
			country,
			contact_name,
			contact_position,
			contact_phone,
			contact_email,
		};

		const [newWarehouseId] = await knex("warehouses")
			.insert(newWarehouse)
			.returning("*");

		res.status(201).json({ id: newWarehouseId, ...newWarehouse });
	} catch (err) {
		res.status(500).send(`Error creating warehouse: ${err}`);
	}
};

const getInventory = async (req, res) => {
	try {
		const inventories = await knex("warehouses")
			.join("inventories", "warehouses.id", "inventories.warehouse_id")
			.where({ warehouse_id: req.params.id })
			.select("inventories.id", "item_name", "category", "status", "quantity");

		if (inventories.length === 0) {
			res.status(404).json({
				message: `Unable to find inventories for warehouse with id ${req.params.id}`,
			});
		}

		res.json(inventories);
	} catch (error) {
		res
			.status(500)
			.send(
				`Error retrieving inventories for warehouse with id ${req.params.id}: ${error}`
			);
	}
};

const deleteWarehouse = async (req, res) => {
	try {
		const warehouseDeleted = await knex("warehouses")
			.where({ id: req.params.id })
			.del();

		console.log(warehouseDeleted);

		if (warehouseDeleted === 0) {
			res
				.status(404)
				.json({ message: `Unable to find warehouse with id ${req.params.id}` });
		}

		res.sendStatus(204);
	} catch (error) {
		res.status(500).json({
			message: `Error deleting warehouse with id ${req.params.id}: ${error}`,
		});
	}
};

const editWarehouse = async (req, res) => {
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
		const warehouseUpdated = await knex("warehouses")
			.where({ id: req.params.id })
			.update({
				warehouse_name: warehouse_name,
				address: address,
				city: city,
				country: country,
				contact_name: contact_name,
				contact_position: contact_position,
				contact_phone: contact_phone,
				contact_email: contact_email,
			});

		if (warehouseUpdated === 0) {
			res.status(404).json({
				message: `Unable to find warehouse with id ${req.params.id}`,
			});
		}

		const editedWarehouse = await knex("warehouses")
			.where({ id: req.params.id })
			.select(
				"id",
				"warehouse_name",
				"address",
				"city",
				"country",
				"contact_name",
				"contact_position",
				"contact_phone",
				"contact_email"
			)
			.first();
		res.status(200).json(editedWarehouse);
	} catch (error) {
		res
			.status(500)
			.send(`Error editing warehouse with id ${req.params.id}: ${error}`);
	}
};

export {
	index,
	findOne,
	createWarehouse,
	getInventory,
	deleteWarehouse,
	editWarehouse,
};
