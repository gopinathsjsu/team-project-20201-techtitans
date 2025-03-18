import mongoose from "mongoose";

export const RestaurantSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		cuisineType: {
			type: String,
			enum: [
				"American",
				"Chinese",
				"Ethiopian",
				"French",
				"Fusion",
				"Indian",
				"Italian",
				"Japanese",
				"Korean",
				"Pakistani",
				"Mexican",
				"Spanish",
				"Thai",
				"Turkish",
				"Vietnamese",
				"Other",
			],
			default: "Other",
			required: true,
		},
		costRating: {
			type: String,
			enum: ["$", "$$", "$$$"],
			default: "$",
			required: true,
		},
		avgRating: {
			type: Number,
			default: 5,
			required: true,
		},
		bookingsToday: {
			type: Number,
			default: 0,
			required: true,
		},
		address: {
			type: String,
			required: true,
			trim: true,
		},
		contactInfo: {
			type: String,
			match: /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/,
			required: true,
		},
		hours: {
			type: Map,
			of: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
			trim: true,
		},
		location: {
			type: [Number],
			required: true,
		},
		pendingApproval: {
			type: Boolean,
			default: true,
			required: true,
		},
		approved: {
			type: Boolean,
		},
	},
	{ collection: "Restaurants" }
);
