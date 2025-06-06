import mongoose from "mongoose";
import dotenv from "dotenv";
import { TableSchema } from "./tableSchema.js";

dotenv.config();

let dbConnection;

export function setConnection(newConn) {
	dbConnection = newConn;
	return dbConnection;
}

function getDbConnection() {
	if (!dbConnection) {
		dbConnection = mongoose.createConnection(process.env.MONGODB_URI);
	}
	return dbConnection;
}

export async function getAvailableTablesbyTime(
	restaurantId,
	timeSlot,
	numPeople
) {
	const conn = getDbConnection();
	const TableModel = conn.model("Table", TableSchema);
	try {
		const peopleNum = parseInt(numPeople, 10);

		const availableTables = TableModel.find({
			restaurantId: restaurantId,
			timeSlot: timeSlot,
			seats: { $gte: peopleNum },
			taken: false,
		}).sort({ tableNum: 1 });

		return availableTables;
	} catch (error) {
		console.error("Error in getAvailableTablesbyTime:", error);
		return false;
	}
}

export async function addTable(table) {
	const conn = getDbConnection();
	const TableModel = conn.model("Table", TableSchema);
	try {
		const tableToAdd = new TableModel(table);
		const savedTable = await tableToAdd.save();
		return savedTable;
	} catch (error) {
		return false;
	}
}

export async function updateTableStatus(
	tableNum,
	timeSlot,
	restaurantId,
	isTaken
) {
	const conn = getDbConnection();
	const TableModel = conn.model("Table", TableSchema);
	try {
		const updatedTable = await TableModel.findOneAndUpdate(
			{
				tableNum: tableNum,
				timeSlot: timeSlot,
				restaurantId: restaurantId,
			},
			{ $set: { taken: isTaken } },
			{ new: true }
		);
		return updatedTable;
	} catch (error) {
		return false;
	}
}

export async function removeTables(id) {
	const conn = getDbConnection();
	const TableModel = conn.model("Table", TableSchema);
	try {
		const removedTables = TableModel.deleteMany({
			restaurantId: id,
		});
		return removedTables;
	} catch (error) {
		return false;
	}
}

export async function getTablesByRestaurantId(restaurantId) {
	const conn = getDbConnection();
	const TableModel = conn.model("Table", TableSchema);
	try {
		return await TableModel.find({ restaurantId });
	} catch (error) {
		console.error("Error fetching all tables:", error);
		return [];
	}
}
