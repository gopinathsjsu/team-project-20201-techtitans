import { useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import "./ReservationConfirmation.css";

const ReservationConfirmation = () => {
	console.log("Loaded ReservationConfirmation");
	const location = useLocation();
	const { restaurantName, date, time, people, table } = location.state || {};

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
				<button className="complete-reservation-button">
					Complete Reservation
				</button>
			</div>
		</div>
	);
};

export default ReservationConfirmation;
