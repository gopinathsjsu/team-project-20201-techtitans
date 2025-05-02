import mongoose from "mongoose";
import dotenv from "dotenv";
import { MenuSchema } from "./menuSchema.js";

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

export async function getMenuByRestaurantId(restaurantId) {
	const conn = getDbConnection();
	const MenuModel = conn.model("Menu", MenuSchema);
	try {
		const menus = await MenuModel.find({ restaurantId });
		return menus;
	} catch (error) {
		return false;
	}
}

export async function addMenu(menu) {
	const conn = getDbConnection();
	const MenuModel = conn.model("Menu", MenuSchema);
	try {
		const menuToAdd = new MenuModel(menu);
		const savedMenu = await menuToAdd.save();
		return savedMenu;
	} catch (error) {
		return false;
	}
}

export async function removeMenus(id) {
	const conn = getDbConnection();
	const MenuModel = conn.model("Menu", MenuSchema);
	try {
		const removedMenus = MenuModel.deleteMany({
			restaurantId: id,
		});
		return removedMenus;
	} catch (error) {
		return false;
	}
}
