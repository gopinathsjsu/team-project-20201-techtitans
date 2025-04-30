import "./RestaurantListing.css";
import { Link } from "react-router-dom";
import axios from "axios";

function RestaurantListing(props) {
	const { name, interact, setAlertMessages, id } = props;
	async function makeUpdateCall(name, status) {
		try {
			const restaurantStatus = {
				updateStatus: status,
			};
			const updatedRestaurant = await axios.patch(
				`http://127.0.0.1:5000/restaurants/${name}`,
				restaurantStatus
			);
			return updatedRestaurant;
		} catch (error) {
			return error;
		}
	}

	function updateRestaurantStatus(name, status) {
		makeUpdateCall(name, status).then((result) => {
			if (result && result.status === 201) {
				setAlertMessages({
					isOpen: true,
					message: "Restaurant Approval Updated",
					type: "success",
				});
			} else {
				if (result.response.data) {
					setAlertMessages({
						isOpen: true,
						message: result.response.data,
						type: "error",
					});
				}
			}
		});
	}

	return (
		<div className="thumbnail">
			<Link to="/restaurant-details">
				<div className="image"></div>
			</Link>
			<Link to="/restaurant-details">
				<h3 className="name">{name}</h3>
			</Link>
			{interact == "admin-remove-btn" && (
				<button className="thumbnail-btn">Remove</button>
			)}
			{interact == "admin-pending-btns" && (
				<div className="pair-btns">
					<button
						className="thumbnail-btn"
						onClick={(e) => {
							e.preventDefault();
							updateRestaurantStatus(name, true);
						}}
					>
						Approve
					</button>
					<button
						className="thumbnail-btn"
						onClick={(e) => {
							e.preventDefault();
							updateRestaurantStatus(name, false);
						}}
					>
						Deny
					</button>
				</div>
			)}
			{interact == "restaurant-manager-btns" && (
				<div className="pair-btns">
					{id ? (
						<Link
							to={`/restaurant-manager-update-restaurant/${id}`}
						>
							<button className="thumbnail-btn">Update</button>
						</Link>
					) : (
						<button className="thumbnail-btn">Update</button>
					)}
					{id ? (
						<Link
							to={`/restaurant-manager-restaurant-bookings/${id}`}
						>
							<button className="thumbnail-btn">Bookings</button>
						</Link>
					) : (
						<button className="thumbnail-btn">Bookings</button>
					)}
				</div>
			)}
			{interact == "customer-btns" && (
				<div className="four-btns">
					<button className="smaller-thumbnail-btn">Slot 1</button>
					<button className="smaller-thumbnail-btn">Slot 1</button>
					<button className="smaller-thumbnail-btn">Slot 1</button>
					<button className="smaller-thumbnail-btn">Reserve</button>
				</div>
			)}
			{interact == "customer-remove-btn" && (
				<button className="thumbnail-btn">Remove</button>
			)}
		</div>
	);
}

export default RestaurantListing;
