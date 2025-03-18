import "./RestaurantReservationConfirmation.css";

function RestaurantReservationConfirmation(props) {
	const handleFormSubmit = (event) => {
		event.preventDefault();
	};

	return (
		<>
			<h2>{props.name}</h2>
			<form className="reservation-form" onSubmit={handleFormSubmit}>
				<div className="reservation-control">
					<label className="reservation-info">
						Date: {props.date}
					</label>
					<label className="reservation-info">
						Time: {props.time}
					</label>
					<label className="reservation-info">
						Number of People: {props.numPeople}
					</label>
				</div>
				<button type="submit" className="complete-btn">
					Complete Reservation
				</button>
			</form>
		</>
	);
}

export default RestaurantReservationConfirmation;
