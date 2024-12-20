import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

const index = async (req, res) => {
	const { s } = req.query;
	try {
		const query = knex("inventories")
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

		//Diving deeper: search functionality
		if (s) {
			query.where(function () {
				this.where("inventories.item_name", "like", `%${s}%`)
					.orWhere("warehouses.warehouse_name", "like", `%${s}%`)
					.orWhere("inventories.description", "like", `%${s}%`)
					.orWhere("inventories.category", "like", `%${s}%`);
			});
		}

		const data = await query;
		res.status(200).json(data);
	} catch (err) {
		res.status(500).send(`Error retrieving inventories: ${err}`);
	}
};

const findOne = async (req, res) => {
	try {
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

		if (inventoryItemFound.length === 0) {
			return res.status(404).json({
				message: `Inventory item with ID ${req.params.id} not found`,
			});
		}

		const inventoryItemData = inventoryItemFound[0];

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
	const { warehouse_id, item_name, description, category, status } = req.body;
	const quantity = Number(req.body.quantity);
	const { id } = req.params;

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

		const selectedInventoryFields = [
			"id",
			"warehouse_id",
			"item_name",
			"description",
			"category",
			"status",
			"quantity",
		];

		const updatedInventoryItem = await knex("inventories")
			.select(...selectedInventoryFields)
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
