import "./CustomerProfile.css";
import Navbar from "../../components/Navbar/Navbar";
import RestaurantListing from "../../components/RestaurantListing/RestaurantListing";

function CustomerProfile() {
	return (
		<>
			<Navbar role="customer" />
			<div className="customer-info">
				<h2>Profile</h2>
				<div className="customer-photo"></div>
				<h3>Username: happyEater</h3>
				<h3>Email: happyeater@gmail.com</h3>
				<button className="update-password-btn">Update Password</button>
			</div>
			<h2 className="restaurants-listing-title">Current Reservations</h2>
			<div className="restaurants-listing">
				<RestaurantListing
					name="Nora's"
					interact="customer-remove-btn"
				/>
				<h3 className="time-for-restaurant">Reservation: 5:00pm</h3>
			</div>
			<h2 className="restaurants-listing-title">Favorite Restaurants</h2>
			<div className="restaurants-listing">
				<RestaurantListing name="In N Out" interact="customer-btns" />
				<RestaurantListing
					name="Burger King"
					interact="customer-btns"
				/>
				<RestaurantListing
					name="Palmer's Joint"
					interact="customer-btns"
				/>
			</div>
			<h2 className="restaurants-listing-title">
				Restaurants You've Reviewed
			</h2>
			<div className="restaurants-listing">
				<RestaurantListing
					name="Mario's Place"
					interact="customer-btns"
				/>
				<RestaurantListing
					name="Luigi's Macaroni"
					interact="customer-btns"
				/>
				<RestaurantListing
					name="Laura's Buffet"
					interact="customer-btns"
				/>
				<RestaurantListing
					name="Little Richard's Almanac Deluxe Edition"
					interact="customer-btns"
				/>
				<RestaurantListing name="In N Out" interact="customer-btns" />
				<RestaurantListing
					name="Burger King"
					interact="customer-btns"
				/>
				<RestaurantListing
					name="Palmer's Joint"
					interact="customer-btns"
				/>
			</div>
		</>
	);
}

export default CustomerProfile;
