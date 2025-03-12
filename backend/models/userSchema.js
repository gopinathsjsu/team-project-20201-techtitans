import mongoose from "mongoose";

export const UserSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			trim: true,
		},
		password: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			trim: true,
		},
		status: {
			type: String,
			enum: ["Customer", "RestaurantManager", "Admin"],
			default: "Customer",
			required: true,
		},
		reservations: {
			type: [mongoose.SchemaTypes.ObjectId],
			ref: "Reservation",
		},
		restaurantListings: {
			type: [String],
			ref: "Restaurant",
		},
	},
	{ collection: "Users" }
);
