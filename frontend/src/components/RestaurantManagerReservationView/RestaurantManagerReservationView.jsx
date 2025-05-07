import "./RestaurantManagerReservationView.css";

function RestaurantManagerReservationView(props) {
	const { userName, table, time, numberOfPeople } = props;
	return (
		<div className="reserve-details-rest-man">
			<div className="reserve-details-rest-man-row">
				<span className="reserve-details-rest-man-label">
					Booked by:
				</span>
				<span className="reserve-details-rest-man-value">
					{userName}
				</span>
			</div>
			<div className="reserve-details-rest-man-row">
				<span className="reserve-details-rest-man-label">Table:</span>
				<span className="reserve-details-rest-man-value">{table}</span>
			</div>
			<div className="reserve-details-rest-man-row">
				<span className="reserve-details-rest-man-label">Time:</span>
				<span className="reserve-details-rest-man-value">{time}</span>
			</div>
			<div className="reserve-details-rest-man-row">
				<span className="reserve-details-rest-man-label">
					Number of People:
				</span>
				<span className="reserve-details-rest-man-value">
					{numberOfPeople}
				</span>
			</div>
		</div>
	);
}

export default RestaurantManagerReservationView;
