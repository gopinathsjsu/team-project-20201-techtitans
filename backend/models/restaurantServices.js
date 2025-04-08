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

async function findRestaurantByName(name) {
	const conn = getDbConnection();
	const RestaurantModel = conn.model("Restaurant", RestaurantSchema);
	try {
		return await RestaurantModel.findOne({ name });
	} catch (error) {
		return undefined;
	}
}

async function findRestaurantByLoc(loc) {
	const conn = getDbConnection();
	const RestaurantModel = conn.model("Restaurant", RestaurantSchema);
	try {
		return await RestaurantModel.findOne({ loc });
	} catch (error) {
		return undefined;
	}
}

export async function getVerifiedRestaurants() {
	const conn = getDbConnection();
	const RestaurantModel = conn.model("Restaurant", RestaurantSchema);
	try {
		const verifiedRestaurants = RestaurantModel.find({
			pendingApproval: false,
			approved: true,
		});
		return verifiedRestaurants;
	} catch (error) {
		return false;
	}
}

export async function getPendingRestaurants() {
	const conn = getDbConnection();
	const RestaurantModel = conn.model("Restaurant", RestaurantSchema);
	try {
		const pendingRestaurants = RestaurantModel.find({
			pendingApproval: true,
		});
		return pendingRestaurants;
	} catch (error) {
		return false;
	}
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

export async function updateRestaurantStatus(name, status) {
	const conn = getDbConnection();
	const RestaurantModel = conn.model("Restaurant", RestaurantSchema);
	try {
		const updatedRestaurant = await RestaurantModel.findOneAndUpdate(
			{ name: name },
			{ $set: { pendingApproval: false, approved: status } },
			{ new: true }
		);
		return updatedRestaurant;
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