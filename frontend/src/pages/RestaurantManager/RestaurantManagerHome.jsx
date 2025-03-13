import Navbar from "../../components/Navbar/Navbar";
import RestaurantListing from "../../components/RestaurantListing/RestaurantListing";
import RestaurantReservationConfirmation from "../../components/RestaurantReservationConfirmation/RestaurantReservationConfirmation";

function RestaurantManagerHome(props) {
	// temporarily show all pending & verified restaurants
	const { pendingRestaurants, verifiedRestaurants, setAlertMessages } = props;
	const pendingListings = pendingRestaurants.map((listing) => (
		<div className="restaurants-listing" key={listing.name}>
			<RestaurantListing
				name={listing.name}
				interact={"restaurant-manager-btns"}
				setAlertMessages={setAlertMessages}
			/>
		</div>
	));
	const verifiedListings = verifiedRestaurants.map((listing) => (
		<div className="restaurants-listing" key={listing.name}>
			<RestaurantListing
				name={listing.name}
				interact={"restaurant-manager-btns"}
				setAlertMessages={setAlertMessages}
			/>
		</div>
	));

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
			<h2 className="restaurants-listing-title">Pending Approval</h2>
			<div className="restaurants-listing">{pendingListings}</div>
			<h2 className="restaurants-listing-title">Verified</h2>
			<div className="restaurants-listing">{verifiedListings}</div>
		</>
	);
}

export default RestaurantManagerHome;
