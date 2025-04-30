import Navbar from "../../components/Navbar/Navbar";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import RestaurantManagerReservationView from "../../components/RestaurantManagerReservationView/RestaurantManagerReservationView";
import "./RestaurantManagerRestaurantBookings.css";

function RestaurantManagerRestaurantBookings() {
	const { id } = useParams();
	const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
	const [restaurant, setRestaurant] = useState(null);
	const [reservationsByRestaurantID, setReservationsByRestaurantID] =
		useState([]);

	async function fetchRestaurant() {
		try {
			const response = await axios.get(
				`http://localhost:5000/restaurants/${id}`
			);
			return response.data;
		} catch (error) {
			console.error(
				`Failed to fetch restaurant with restaurant ID: ${id}:`,
				error
			);
			return false;
		}
	}

	async function fetchReservationsByRestaurantID() {
		try {
			const response = await axios.get(
				`http://127.0.0.1:5000/reservations/restaurant/${id}`
			);
			return response.data;
		} catch (error) {
			console.error(
				`Failed to fetch reservations for restaurant with restaurant ID: ${id}:`,
				error
			);
			return false;
		}
	}

	const [userNames, setUserNames] = useState({});

	async function fetchUserByUserID(userId) {
		if (userNames[userId]) return userNames[userId];
		try {
			const response = await axios.get(
				`http://localhost:5000/username/${userId}`
			);
			const name = response.data.username;
			setUserNames((prev) => ({ ...prev, [userId]: name }));
			return name;
		} catch (error) {
			console.error(`Failed to fetch user with ID: ${userId}`, error);
			setUserNames((prev) => ({ ...prev, [userId]: "Unknown User" }));
			return "Unknown User";
		}
	}

	useEffect(() => {
		if (id) {
			fetchRestaurant().then((result) => {
				if (result) {
					setRestaurant(result);
				}
			});
			fetchReservationsByRestaurantID().then((result) => {
				if (result) {
					setReservationsByRestaurantID(result);
					result.forEach((reservation) => {
						fetchUserByUserID(reservation.userId);
					});
				}
			});
		}
	}, [id]);

	function getReservationsByDate(allReservations, selectedDate) {
		return allReservations
			.filter((reserveDetails) => {
				const reservationDate = new Date(reserveDetails.date)
					.toISOString()
					.split("T")[0];
				return reservationDate === selectedDate;
			})
			.map((reserveDetails) => (
				<div
					className="rest-man-restaurants-booking-each"
					key={reserveDetails._id}
				>
					<RestaurantManagerReservationView
						userName={
							userNames[reserveDetails.userId] || "Loading..."
						}
						table={`Table ${reserveDetails.table.tableNum}`}
						time={reserveDetails.table.timeSlot}
						numberOfPeople={reserveDetails.numberOfPeople}
					/>
				</div>
			));
	}

	const reservationsByDate = getReservationsByDate(
		reservationsByRestaurantID,
		date
	);

	return (
		<>
			<Navbar role="restaurant-manager" />
			<div className="rest-man-restaurant-bookings-page">
				<div className="rest-man-restaurant-bookings-label">
					{restaurant ? (
						<h2>{restaurant.name} Bookings</h2>
					) : (
						<h2>Loading...</h2>
					)}
					<h3>Select Date:</h3>
					<input
						type="date"
						value={date}
						onChange={(e) => setDate(e.target.value)}
					/>
				</div>
				<div className="rest-man-restaurants-bookings-container">
					{reservationsByDate.length > 0 ? (
						reservationsByDate
					) : (
						<p>No reservations for this date.</p>
					)}
				</div>
			</div>
		</>
	);
}

export default RestaurantManagerRestaurantBookings;
