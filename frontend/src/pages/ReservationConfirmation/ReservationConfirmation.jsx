import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import AlertMessage from "../../components/AlertMessage";
import Navbar from "../../components/Navbar/Navbar";
import "./ReservationConfirmation.css";

function ReservationConfirmation(props) {
	const { alertMessages, setAlertMessages } = props;
	const [isSubmitting, setIsSubmitting] = useState(false);
	const location = useLocation();
	const navigate = useNavigate();
	const { restaurantName, restaurantId, userId, date, time, people, table } =
		location.state || {};
	const finalUserId = userId || localStorage.getItem("userId");

	const handleCompleteReservation = async () => {
		if (isSubmitting) return;
		setIsSubmitting(true);

		if (!finalUserId) {
			setAlertMessages({
				isOpen: true,
				message: "You must be logged in to make a reservation!",
				type: "error",
			});
			navigate("/login");
			return;
		}
		try {
			const reservationData = {
				userId: finalUserId,
				restaurantId,
				date,
				time,
				numberOfPeople: parseInt(people),
				tableNum: table,
				timeSlot: time,
			};

			const reservationRes = await axios.post(
				"http://restaurant-api-alb-405497354.us-east-2.elb.amazonaws.com:5000/reservations",
				reservationData
			);

			setAlertMessages({
				isOpen: true,
				message: "Reservation successfully booked!",
				type: "success",
			});
			navigate("/customer-profile");
		} catch (error) {
			console.error("Error completing reservation:", error);
			setAlertMessages({
				isOpen: true,
				message: "Failed to complete reservation.",
				type: "error",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="reservation-confirmation-page">
			<Navbar role="customer" />
			<div className="confirmation-details">
				<h2>{restaurantName}</h2>
				<div className="details">
					<div className="detail-item">
						<span>Date</span>
						<span>{date}</span>
					</div>
					<div className="detail-item">
						<span>Time</span>
						<span>{time}</span>
					</div>
					<div className="detail-item">
						<span>No of people</span>
						<span>{people}</span>
					</div>
					<div className="detail-item">
						<span>Table Number</span>
						<span>{table}</span>
					</div>
				</div>
				<button
					className="complete-reservation-button"
					onClick={handleCompleteReservation}
					disabled={isSubmitting}
				>
					Complete Reservation
				</button>
				<AlertMessage
					alertMessages={alertMessages}
					setAlertMessages={setAlertMessages}
				/>
			</div>
		</div>
	);
}

export default ReservationConfirmation;
