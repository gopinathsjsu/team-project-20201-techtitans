import Navbar from "../../components/Navbar/Navbar";
import RestaurantListing from "../../components/RestaurantListing/RestaurantListing";
import "./RestaurantManagerHome.css";

function RestaurantManagerHome(props) {
	const {
		pendingRestaurantsByEmail,
		verifiedRestaurantsByEmail,
		setAlertMessages,
	} = props;
	const pendingEmailListings = pendingRestaurantsByEmail.map((listing) => (
		<div className="restaurants-listing" key={listing._id}>
			<RestaurantListing
				name={listing.name}
				interact={"restaurant-manager-btns"}
				setAlertMessages={setAlertMessages}
			/>
		</div>
	));
	const verifiedEmailListings = verifiedRestaurantsByEmail.map((listing) => (
		<div className="restaurants-listing" key={listing._id}>
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
			<div className="rest-man-page-wrapper">
				<div className="rest-man-home-restaurants">
					<h2>Your Restaurants Pending Approval</h2>
					{pendingEmailListings.length > 0 ? (
						<div className="rest-man-restaurants-listing">
							{pendingEmailListings}
						</div>
					) : (
						<p>No Restaurants Added</p>
					)}
					<h2>Your Verified Restaurants</h2>
					{verifiedEmailListings.length > 0 ? (
						<div className="rest-man-restaurants-listing">
							{verifiedEmailListings}
						</div>
					) : (
						<p>No Restaurants Added</p>
					)}
				</div>
			</div>
		</>
	);
}

export default RestaurantManagerHome;
