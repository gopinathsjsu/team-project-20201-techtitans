import Navbar from "../../components/Navbar/Navbar";
import RestaurantReservation from "../../components/RestaurantReservation/RestaurantReservation";

function RestaurantManagerHome() {
	return (
		<>
			<Navbar role="restaurant-manager" />
			<RestaurantReservation
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
