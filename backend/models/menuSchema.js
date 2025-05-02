import mongoose from "mongoose";

export const MenuSchema = new mongoose.Schema(
	{
		restaurantId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Restaurant",
			required: true,
		},
		title: {
			type: String,
			required: true,
			trim: true,
		},
		dishes: [
			{
				name: {
					type: String,
					required: true,
					trim: true,
				},
				description: {
					type: String,
					required: true,
					trim: true,
				},
				cost: {
					type: mongoose.Types.Decimal128,
					required: true,
				},
				photo: {
					type: String,
					default: "",
				},
				isHighlightDish: {
					type: Boolean,
					required: true,
					default: false,
				},
			},
		],
	},
	{ collection: "Menus" }
);
