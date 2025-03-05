import "./UserProfile.css";
import Navbar from "../../components/Navbar/Navbar";
import RestaurantListing from "../../components/RestaurantListing/RestaurantListing";

/*
This page is really basic. The layout is almost done I think, we should all discuss and agree on
what should be on this page. I didn't use any db data. Just typed in stuff as a placeholder.
*/

function UserProfile() {
	return (
		<>
			<Navbar />
			<div className="user-info">
				<h2>Profile</h2>
				<div className="user-photo"></div>
				<h3>Username: happyEater</h3>
				<h3>Email: happyeater@gmail.com</h3>
				<button className="update-password-btn">Update Password</button>
			</div>
			<h2 className="restaurants-listing-title">Current Reservations</h2>
			<div className="restaurants-listing">
				<RestaurantListing name="Nora's" />
				<h3 className="time-for-restaurant">Reservation: 5:00pm</h3>
			</div>
			<h2 className="restaurants-listing-title">Favorite Restaurants</h2>
			<div className="restaurants-listing">
				<RestaurantListing name="In N Out" />
				<RestaurantListing name="Burger King" />
				<RestaurantListing name="Palmer's Joint" />
			</div>
			<h2 className="restaurants-listing-title">
				Restaurants You've Reviewed
			</h2>
			<div className="restaurants-listing">
				<RestaurantListing name="Mario's Place" />
				<RestaurantListing name="Luigi's Macaroni" />
				<RestaurantListing name="Laura's Buffet" />
				<RestaurantListing name="Little Richard's Almanac Deluxe Edition" />
				<RestaurantListing name="In N Out" />
				<RestaurantListing name="Burger King" />
				<RestaurantListing name="Palmer's Joint" />
			</div>
		</>
	);
}

export default UserProfile;
