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
		verifiedRestaurants,
		setVerifiedRestaurants,
		fetchVerifiedRestaurants,
		alertMessages,
		setAlertMessages,
	} = props;

	const pendingListings = pendingRestaurants.map((listing) => (
		<div className="restaurants-listing" key={listing.name}>
			<RestaurantListing
				id={listing._id}
				name={listing.name}
				interact={"admin-pending-btns"}
				setAlertMessages={setAlertMessages}
			/>
		</div>
	));

	const verifiedListings = verifiedRestaurants.map((listing) => (
		<div className="restaurants-listing" key={listing.name}>
			<RestaurantListing
				id={listing._id}
				name={listing.name}
				interact={"admin-remove-btn"}
				setAlertMessages={setAlertMessages}
			/>
		</div>
	));

	useEffect(() => {
		fetchPendingRestaurants().then((result) => {
			setPendingRestaurants(result);
		});
		fetchVerifiedRestaurants().then((result) => {
			setVerifiedRestaurants(result);
		});
	}, [pendingRestaurants, verifiedRestaurants]);

	return (
		<>
			<Navbar role="admin" />
			<div className="customer-info">
				<h2>Admin Dashboard</h2>
			</div>
			<h2 className="restaurants-listing-title">Pending</h2>
			<div className="admin-restaurants-listing">{pendingListings}</div>
			<h2 className="restaurants-listing-title">Verified Restaurants</h2>
			<div className="admin-restaurants-listing">{verifiedListings}</div>
			<AlertMessage
				alertMessages={alertMessages}
				setAlertMessages={setAlertMessages}
			/>
		</>
	);
}

export default AdminDash;
