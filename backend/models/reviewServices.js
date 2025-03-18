import mongoose from "mongoose";
import dotenv from "dotenv";
import { ReviewSchema } from "./reviewSchema.js";

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

export async function addReview(review) {
	const conn = getDbConnection();
	const ReviewModel = conn.model("Review", ReviewSchema);
	try {
		const reviewToAdd = new ReviewModel(review);
		const savedReview = await reviewToAdd.save();
		return savedReview;
	} catch (error) {
		return false;
	}
}

export async function getReviewsByRestaurantId(restaurantId) {
	const conn = getDbConnection();
	const ReviewModel = conn.model("Review", ReviewSchema);
	try {
		const reviews = await ReviewModel.find({ restaurantId });
		return reviews;
	} catch (error) {
		return false;
	}
}
