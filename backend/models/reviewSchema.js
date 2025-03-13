import mongoose from "mongoose";

export const ReviewSchema = new mongoose.Schema(
	{
		restaurantId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Restaurant",
			required: true,
		},
		restaurant: {
			type: String,
			required: true,
			trim: true,
		},
		rating: {
			type: Number,
			required: true,
			min: 1,
			max: 5,
		},
		comment: {
			type: String,
			trim: true,
		},
		user: {
			type: String,
			required: true,
			trim: true,
		},
		date: {
			type: Date,
			default: Date.now,
		},
	},
	{ collection: "Reviews" }
);

export default mongoose.model("Review", ReviewSchema);
