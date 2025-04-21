import mongoose from "mongoose";

export const ReservationSchema = new mongoose.Schema(
	{
		reservationId: {
			type: mongoose.Schema.Types.ObjectId,
			default: () => new mongoose.Types.ObjectId(),
			required: true,
		},
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
		date: {
			type: Date,
			required: true,
		},
		time: {
			type: String,
			required: true,
		},
		numberOfPeople: {
			type: Number,
			required: true,
		},
	},
	{ collection: "Reservations" }
);

export default mongoose.model("Reservation", ReservationSchema);
