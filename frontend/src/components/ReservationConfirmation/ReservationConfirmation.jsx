import React from "react";
import { useLocation } from "react-router-dom";
import "./ReservationConfirmation.css";

const ReservationConfirmation = () => {
	const location = useLocation();
	const { restaurantName, date, time, people } = location.state || {};

	return (
		<div className="reservation-confirmation-page">
			<header className="header">
				<h1>BookTable</h1>
				<div className="user-info">
					<span>User Name</span>
					<button>Log out</button>
				</div>
			</header>
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
				</div>
				<button className="complete-reservation-button">
					Complete Reservation
				</button>
			</div>
		</div>
	);
};

export default ReservationConfirmation;
