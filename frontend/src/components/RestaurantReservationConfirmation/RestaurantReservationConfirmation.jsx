import "./RestaurantReservationConfirmation.css";

function RestaurantReservationConfirmation(props) {
	const handleFormSubmit = (event) => {
		event.preventDefault();
	};

	return (
		<>
			<h2>{props.name}</h2>
			<form
				className="reservation-confirmation-form"
				onSubmit={handleFormSubmit}
			>
				<div className="reservation-confirmation-control">
					<label className="reservation-confirmation-info">
						Date: {props.date}
					</label>
					<label className="reservation-confirmation-info">
						Time: {props.time}
					</label>
					<label className="reservation-confirmation-info">
						Number of People: {props.numPeople}
					</label>
				</div>
				<button
					type="submit"
					className="reservation-confirmation-complete-btn"
				>
					Complete Reservation
				</button>
			</form>
		</>
	);
}

export default RestaurantReservationConfirmation;
