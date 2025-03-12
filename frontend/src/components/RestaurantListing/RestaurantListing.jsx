import "./RestaurantListing.css";
import { Link } from "react-router-dom";

function RestaurantListing(props) {
	return (
		<div className="thumbnail">
			<Link to="/restaurant-details">
				<div className="image"></div>
			</Link>
			<Link to="/restaurant-details">
				<h3 className="name">{props.name}</h3>
			</Link>
			{props.interact == "admin-remove-btn" && (
				<button className="thumbnail-btn">Remove</button>
			)}
			{props.interact == "admin-pending-btns" && (
				<div className="pair-btns">
					<button className="thumbnail-btn">Approve</button>
					<button className="thumbnail-btn">Deny</button>
				</div>
			)}
			{props.interact == "restaurant-manager-btns" && (
				<div className="pair-btns">
					<button className="thumbnail-btn">Update</button>
					<button className="thumbnail-btn">Bookings</button>
				</div>
			)}
			{props.interact == "customer-btns" && (
				<div className="four-btns">
					<button className="smaller-thumbnail-btn">Slot 1</button>
					<button className="smaller-thumbnail-btn">Slot 1</button>
					<button className="smaller-thumbnail-btn">Slot 1</button>
					<button className="smaller-thumbnail-btn">Reserve</button>
				</div>
			)}
			{props.interact == "customer-remove-btn" && (
				<button className="thumbnail-btn">Remove</button>
			)}
		</div>
	);
}

export default RestaurantListing;
