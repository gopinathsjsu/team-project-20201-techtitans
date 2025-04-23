import "./RestaurantReservationConfirmation.css";

function RestaurantReservationConfirmation(props) {
	const { name, date, time, numPeople, table } = props;
	const handleFormSubmit = (event) => {
		event.preventDefault();
	};

	return (
		<>
			<h2>{name}</h2>
			<form
				className="reservation-confirmation-form"
				onSubmit={handleFormSubmit}
			>
				<div className="reservation-confirmation-control">
					<label className="reservation-confirmation-info">
						Date: {date}
					</label>
					<label className="reservation-confirmation-info">
						Time: {time}
					</label>
					<label className="reservation-confirmation-info">
						Number of People: {numPeople}
					</label>
					<label className="reservation-confirmation-info">
						Table Number: {table}
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
