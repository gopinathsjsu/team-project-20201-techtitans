import Navbar from "../../components/Navbar/Navbar";
import RestaurantReservationConfirmation from "../../components/RestaurantReservationConfirmation/RestaurantReservationConfirmation";

function RestaurantManagerHome() {
	return (
		<>
			<Navbar role="restaurant-manager" />
			<RestaurantReservationConfirmation
				name="Mickey's Kitchen"
				date="3/18/25"
				time="4:00 PM"
				numPeople="8"
			/>
			<h2>This is the Restaurant Manager's Home Page</h2>
		</>
	);
}

export default RestaurantManagerHome;
