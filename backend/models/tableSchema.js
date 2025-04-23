import mongoose from "mongoose";

export const TableSchema = new mongoose.Schema(
	{
		tableNum: {
			type: Number,
			required: true,
			trim: true,
		},
		timeSlot: {
			type: String,
			required: true,
			trim: true,
		},
		seats: {
			type: Number,
			required: true,
			trim: true,
		},
		restaurantId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Restaurant",
			required: true,
		},
		taken: {
			type: Boolean,
			default: false,
			required: true,
		},
	},
	{ collection: "Tables" }
);
