import mongoose from "mongoose";

export const ReservationSchema = new mongoose.Schema(
	{
		reservationId: {
			type: mongoose.SchemaTypes.ObjectId,
			required: true,
		},

		// needs to be continued
	},
	{ collection: "Reservations" }
);
