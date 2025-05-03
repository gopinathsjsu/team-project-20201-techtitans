import mongoose from "mongoose";
import dotenv from "dotenv";
import { ReservationSchema } from "./reservationSchema.js";
import { updateTableStatus } from "./tableServices.js"; 

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

export async function removeReservations(id) {
	const conn = getDbConnection();
	const ReservationModel = conn.model("Reservation", ReservationSchema);
	try {
		const removedReservations = await ReservationModel.deleteMany({
			restaurantId: id,
		});
		return removedReservations;
	} catch (error) {
		return false;
	}
}

export async function deleteReservationById(reservationId) {
	const conn = getDbConnection();
	const ReservationModel = conn.model("Reservation", ReservationSchema);

	try {
		const reservation = await ReservationModel.findById(reservationId);

		if (!reservation) {
			console.error("Reservation not found.");
			return null;
		}

		const { table } = reservation;
		if (!table || !table.tableNum || !table.timeSlot) {
			console.error("Invalid table data:", table);
			return false;
		}

		const tableUpdateResult = await updateTableStatus(
			table.tableNum,
			table.timeSlot,
			reservation.restaurantId,
			false // Mark table as available
		);

		const result = await ReservationModel.findByIdAndDelete(reservationId);

		return result;
	} catch (error) {
		console.error(
			"Error deleting reservation:",
			error.stack || error.message || error
		);
		return false;
	}
}

export async function removeReservations(id) {
	const conn = getDbConnection();
	const ReservationModel = conn.model("Reservation", ReservationSchema);
	try {
		const removedReservations = ReservationModel.deleteMany({
			restaurantId: id,
		});
		return removedReservations;
	} catch (error) {
		return false;
	}
}
