import mongoose from "mongoose";
import dotenv from "dotenv";
import { RestaurantSchema } from "./restaurantSchema.js";

dotenv.config();

let dbConnection;

export function setConnection(newConn) {
	dbConnection = newConn;
	return dbConnection;
}

function getDbConnection() {
	if (!dbConnection) {
		dbConnection = mongoose.createConnection(process.env.MONGODB_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
	}
	return dbConnection;
}

export async function addRestaurant(restaurant) {
	const conn = getDbConnection();
	const RestaurantModel = conn.model("Restaurant", RestaurantSchema);
	try {
		const restaurantToAdd = new RestaurantModel(restaurant);
		const savedRestaurant = await restaurantToAdd.save();
		return savedRestaurant;
	} catch (error) {
		return false;
	}
}
