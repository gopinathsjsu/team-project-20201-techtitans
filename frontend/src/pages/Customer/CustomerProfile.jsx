import "./CustomerProfile.css";
import Navbar from "../../components/Navbar/Navbar";
import RestaurantListing from "../../components/RestaurantListing/RestaurantListing";
import { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";

function CustomerProfile() {
	const [cookies] = useCookies(["auth_token"]);
	const [user, setUser] = useState(null);
	const [reservations, setReservations] = useState([]);

	const handleCancel = async (
		reservationId,
		restaurantId,
		tableNum,
		timeSlot
	) => {
		try {
			await axios.delete(
				`http://localhost:5000/reservations/${reservationId}`
			);

			// makes table available
			await axios.patch(
				`http://localhost:5000/table/${restaurantId}/${tableNum}`,
				{
					timeSlot,
					isTaken: false,
				}
			);

			setReservations(
				reservations.filter((res) => res._id !== reservationId)
			);
		} catch (err) {
			console.error("Failed Cancelling:", err);
		}
	};

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const config = {
					headers: { Authorization: `Bearer ${cookies.auth_token}` },
				};
				const res = await axios.get(
					"http://localhost:5000/user",
					config
				);
				setUser(res.data);
			} catch (err) {
				console.error("Failed to fetch user:", err);
			}
		};

		fetchUser();
	}, [cookies.auth_token]);

	useEffect(() => {
		const fetchReservations = async () => {
			if (!user?._id) return;
			try {
				const res = await axios.get(
					`http://localhost:5000/reservations/user/${user._id}`
				);
				const reservationsWithNames = await Promise.all(
					res.data.map(async (reservation) => {
						const restaurantRes = await axios.get(
							`http://localhost:5000/restaurants/${reservation.restaurantId}`
						);
						return {
							...reservation,
							restaurantName: restaurantRes.data.name,
						};
					})
				);
				setReservations(reservationsWithNames);
			} catch (err) {
				console.error("Failed to fetch reservations:", err);
			}
		};

		fetchReservations();
	}, [user]);

	return (
		<>
			<Navbar role="customer" />
			<div className="customer-info">
				<h2>Customer Profile</h2>
				<h3>
					<u>Username:</u> {user?.username}
				</h3>
				<h3>
					<u>Email:</u> {user?.email}
				</h3>
			</div>

			<h2 className="upcoming-reservation-title">
				Upcoming Reservations
			</h2>
			<div className="restaurants-listing">
				{reservations.length === 0 ? (
					<p>No reservations yet.</p>
				) : (
					reservations.map((res, i) => (
						<div key={i} className="restaurant-card">
							<RestaurantListing
								name={res.restaurantName || "Restaurant"}
								id={res.restaurantId}
								interact="customer-reservation"
							/>
							<h3>
								Reservation on{" "}
								{new Date(res.date).toLocaleDateString(
									"en-US",
									{
										timeZone: "UTC",
									}
								)}{" "}
								<br />
								{res.time} <br />
								{res.numberOfPeople}{" "}
								{res.numberOfPeople === 1 ? "person" : "people"}
								, Table Number: {res.table.tableNum}
							</h3>
							<button
								className="reservation-button"
								onClick={() =>
									handleCancel(
										res._id,
										res.restaurantId,
										res.tableNum,
										res.timeSlot
									)
								}
							>
								Cancel Reservation
							</button>
						</div>
					))
				)}
			</div>
		</>
	);
}

export default CustomerProfile;
