import Navbar from "../../components/Navbar/Navbar";
import RestaurantReservation from "../../components/RestaurantReservation/RestaurantReservation";

function RestaurantManagerHome() {
	return (
		<>
			<Navbar role="restaurant-manager" />
			<RestaurantReservation
				name="Mickey's Kitchen"
				bookingStartTime="8:00 AM"
				bookingEndTime="8:00 PM"
				bookingTimeIntervals="30min"
				maxPeople="14"
			/>
			<h2>This is the Restaurant Manager's Home Page</h2>
		</>
	);
}

export default RestaurantManagerHome;
