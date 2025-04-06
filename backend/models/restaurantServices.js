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
		dbConnection = mongoose.createConnection(process.env.MONGODB_URI);
	}
	return dbConnection;
}

export async function addRestaurant(restaurant) {
	const conn = getDbConnection();
	const RestaurantModel = conn.model("Restaurant", RestaurantSchema);
	try {
		const restaurantToAdd = new RestaurantModel(restaurant);

		let savedRestaurant;
		const checkRestaurantName = await findRestaurantByName(restaurant.name);
		const checkRestaurantLoc = await findRestaurantByLoc(
			restaurant.location
		);

		if (!checkRestaurantName && !checkRestaurantLoc) {
			savedRestaurant = await restaurantToAdd.save();
		} else {
			return "existing restaurant";
		}
		return savedRestaurant;
	} catch (error) {
		return false;
	}
}

export async function getRestaurants() {
    const conn = getDbConnection();
    const RestaurantModel = conn.model("Restaurant", RestaurantSchema);
    try {
        const restaurants = await RestaurantModel.find({ pendingApproval: false });
        return restaurants;
    } catch (error) {
        console.error("Error fetching restaurants:", error);
        return null;
    }
}

export async function getRestaurantById(id) {
    const conn = getDbConnection();
    const RestaurantModel = conn.model("Restaurant", RestaurantSchema);
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }
        const restaurant = await RestaurantModel.findById(id);
        return restaurant;
    } catch (error) {
        console.error("Error in getRestaurantById:", error);
        return null;
    }
}