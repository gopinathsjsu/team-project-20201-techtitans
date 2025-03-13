import mongoose from "mongoose";
import dotenv from "dotenv";
import { GallerySchema } from "./gallerySchema.js";

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

export async function addImage(image) {
	const conn = getDbConnection();
	const GalleryModel = conn.model("Gallery", GallerySchema);
	try {
		const imageToAdd = new GalleryModel(image);
		const savedImage = await imageToAdd.save();
		return savedImage;
	} catch (error) {
		return false;
	}
}

export async function getImagesByRestaurantId(restaurantId) {
	const conn = getDbConnection();
	const GalleryModel = conn.model("Gallery", GallerySchema);
	try {
		const images = await GalleryModel.find({ restaurantId });
		return images;
	} catch (error) {
		return false;
	}
}
