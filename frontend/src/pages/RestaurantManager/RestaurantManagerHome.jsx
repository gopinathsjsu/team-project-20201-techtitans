import Navbar from "../../components/Navbar/Navbar";
import RestaurantListing from "../../components/RestaurantListing/RestaurantListing";

function RestaurantManagerHome(props) {
	const { restaurantsByEmail, setAlertMessages } = props;
	const emailListings = restaurantsByEmail.map((listing) => (
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
			<h2 className="restaurants-listing-title">Your Restaurants</h2>
			<div className="restaurants-listing">{emailListings}</div>
		</>
	);
}

export default RestaurantManagerHome;
