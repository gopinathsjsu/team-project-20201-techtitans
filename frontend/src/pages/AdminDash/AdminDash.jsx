import { useEffect } from "react";
import "./AdminDash.css";
import Navbar from "../../components/Navbar/Navbar";
import RestaurantListing from "../../components/RestaurantListing/RestaurantListing";
import AlertMessage from "../../components/AlertMessage";

function AdminDash(props) {
	const {
		pendingRestaurants,
		setPendingRestaurants,
		fetchPendingRestaurants,
		alertMessages,
		setAlertMessages,
	} = props;
	const pendingListings = pendingRestaurants.map((listing) => (
		<div className="restaurants-listing" key={listing.name}>
			<RestaurantListing
				name={listing.name}
				interact={"admin-pending-btns"}
				setAlertMessages={setAlertMessages}
			/>
		</div>
	));

	useEffect(() => {
		fetchPendingRestaurants().then((result) => {
			setPendingRestaurants(result);
		});
	}, [pendingRestaurants]);

	return (
		<>
			<Navbar role="admin" />
			<div className="customer-info">
				<h2>Admin Dashboard</h2>
			</div>
			<h2 className="restaurants-listing-title">Pending</h2>
			<div className="restaurants-listing">{pendingListings}</div>
			<h2 className="restaurants-listing-title">All Restaurants</h2>
			<div className="restaurants-listing">
				<RestaurantListing
					name="In N Out"
					interact="admin-remove-btn"
				/>
				<RestaurantListing
					name="Burger King"
					interact="admin-remove-btn"
				/>
				<RestaurantListing
					name="Palmer's Joint"
					interact="admin-remove-btn"
				/>
			</div>
			<AlertMessage
				alertMessages={alertMessages}
				setAlertMessages={setAlertMessages}
			/>
		</>
	);
}

export default AdminDash;
