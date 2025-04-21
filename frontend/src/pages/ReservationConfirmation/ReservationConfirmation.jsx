import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar/Navbar";
import "./ReservationConfirmation.css";

const ReservationConfirmation = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { restaurantId, restaurantName, date, time, userId } =
		location.state || {};
	const [people, setPeople] = useState(1);

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const handleReservation = async () => {
		try {
			setLoading(true);
			const res = await axios.post("http://localhost:5000/reservations", {
				userId,
				restaurantId,
				date,
				time,
				numberOfPeople: people,
			});
			if (res.status === 201) {
				navigate("/customer-profile");
			}
		} catch (err) {
			console.error("Reservation failed", err);
			setError("Reservation could not be completed.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="reservation-confirmation-page">
			<Navbar role="customer" />
			<div className="confirmation-details">
				<h1>Confirming Reservation for: {restaurantName}</h1>
				<h3>Date: {date}</h3>
				<h3>Time: {time}</h3>
			</div>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					gap: "12px",
					marginTop: "20px",
				}}
			>
				{" "}
				<label>
					Number of People:
					<select
						value={people}
						onChange={(e) => setPeople(parseInt(e.target.value))}
						style={{ marginLeft: "10px" }}
					>
						{Array.from({ length: 10 }, (_, i) => (
							<option key={i + 1} value={i + 1}>
								{i + 1}
							</option>
						))}
					</select>
				</label>
				{error && <p className="error">{error}</p>}
				<button
					onClick={handleReservation}
					disabled={loading}
					className="complete-reservation-button"
				>
					{loading ? "Booking..." : "Complete Reservation"}
				</button>
			</div>
		</div>
	);
};

export default ReservationConfirmation;
