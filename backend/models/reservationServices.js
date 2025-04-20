import mongoose from "mongoose";
import dotenv from "dotenv";
import { ReservationSchema } from "./reservationSchema.js";

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

export async function addReservation(reservation) {
	const conn = getDbConnection();
	const ReservationModel = conn.model("Reservation", ReservationSchema);
	try {
		const reservationToAdd = new ReservationModel(reservation);
		const savedReservation = await reservationToAdd.save();
		return savedReservation;
	} catch (error) {
		console.error("addReservation error:", error);
		return false;
	}
}

export async function getReservationsByUserId(userId) {
	const conn = getDbConnection();
	const ReservationModel = conn.model("Reservation", ReservationSchema);
	try {
		const reservations = await ReservationModel.find({ userId });
		return reservations;
	} catch (error) {
		return false;
	}
}

export async function getReservationsByRestaurantId(restaurantId) {
	const conn = getDbConnection();
	const ReservationModel = conn.model("Reservation", ReservationSchema);
	try {
		const reservations = await ReservationModel.find({ restaurantId });
		return reservations;
	} catch (error) {
		return false;
	}
}
