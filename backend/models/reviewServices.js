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
		const allReviews = await ReviewModel.find();
		const filteredReviews = allReviews.filter((review) => {
			return review.restaurantId.toString() === restaurantId.toString();
		});
		return filteredReviews;
	} catch (error) {
		return false;
	}
}

export async function removeReviews(id) {
	const conn = getDbConnection();
	const ReviewModel = conn.model("Review", ReviewSchema);
	try {
		const removedReviews = ReviewModel.deleteMany({
			restaurantId: id,
		});
		return removedReviews;
	} catch (error) {
		return false;
	}
}
