import mongoose from "mongoose";

export const ReservationSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		restaurantId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Restaurant",
			required: true,
		},
		table: {
			tableNum: {
				type: Number,
				required: true,
			},
			timeSlot: {
				type: String,
				required: true,
				trim: true,
			},
		},
		date: {
			type: Date,
			required: true,
		},
		time: {
			type: String,
			required: true,
			trim: true,
		},
		numberOfPeople: {
			type: Number,
			required: true,
		},
	},
	{ collection: "Reservations" }
);

export default mongoose.model("Reservation", ReservationSchema);
