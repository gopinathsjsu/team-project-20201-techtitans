import "./AdminDash.css";
import Navbar from "../../components/Navbar/Navbar";
import RestaurantListing from "../../components/RestaurantListing/RestaurantListing";

function AdminDash() {
	return (
		<>
			<Navbar role="admin" />
			<div className="customer-info">
				<h2>Admin Dashboard</h2>
			</div>
			<h2 className="restaurants-listing-title">Pending</h2>
			<div className="restaurants-listing">
				<RestaurantListing
					name="Nora's"
					interact="admin-pending-btns"
				/>
			</div>
			<h2 className="restaurants-listing-title">All Restaurants</h2>
			<div className="restaurants-listing">
				<RestaurantListing name="In N Out" interact="admin-remove-btn" />
				<RestaurantListing
					name="Burger King"
					interact="admin-remove-btn"
				/>
				<RestaurantListing
					name="Palmer's Joint"
					interact="admin-remove-btn"
				/>
			</div>
			
		</>
	);
}

export default AdminDash;
