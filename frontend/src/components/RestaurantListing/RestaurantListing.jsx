import "./RestaurantListing.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function RestaurantListing(props) {
	const { id, name, interact, setAlertMessages } = props;
	const [photoUrl, setPhotoUrl] = useState(null);

	useEffect(() => {
		async function fetchRestaurantPhoto() {
			try {
				const response = await axios.get(
					`http://127.0.0.1:5000/restaurants/${id}`
				);
				if (
					response.status === 200 &&
					response.data.photos.length > 0
				) {
					setPhotoUrl(response.data.photos[0]);
				}
			} catch (error) {
				console.error("Error fetching restaurant photo:", error);
			}
		}

		if (id) {
			fetchRestaurantPhoto();
		}
	}, [id]);

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

	async function makeRemoveCall(id) {
		try {
			const removedRestaurant = await axios.delete(
				`http://127.0.0.1:5000/restaurants/${id}`
			);
			return removedRestaurant;
		} catch (error) {
			return error;
		}
	}

	function removeRestaurant(id) {
		makeRemoveCall(id).then((result) => {
			if (result && result.status === 201) {
				setAlertMessages({
					isOpen: true,
					message: "Restaurant Removed!",
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
			{interact == "customer-reservation" && (
				<div>
					<Link to={`/restaurant/${id}`}>
						{photoUrl ? (
							<img
								src={photoUrl}
								alt="Restaurant"
								className="image"
							/>
						) : (
							<div className="image" />
						)}
					</Link>
					<Link to={`/restaurant/${id}`}>
						<h3 className="name">{name}</h3>
					</Link>
				</div>
			)}
			{interact == "restaurant-manager-btns" && (
				<div>
					{photoUrl ? (
						<img
							src={photoUrl}
							alt="Restaurant"
							className="image"
						/>
					) : (
						<div className="image" />
					)}
					<h3 className="name">{name}</h3>
				</div>
			)}
			{interact == "admin-remove-btn" && (
				<div>
					{photoUrl ? (
						<img
							src={photoUrl}
							alt="Restaurant"
							className="image"
						/>
					) : (
						<div className="image" />
					)}
					<h3 className="name">{name}</h3>
				</div>
			)}
			{interact == "admin-pending-btns" && (
				<div>
					{photoUrl ? (
						<img
							src={photoUrl}
							alt="Restaurant"
							className="image"
						/>
					) : (
						<div className="image" />
					)}
					<h3 className="name">{name}</h3>
				</div>
			)}
			{interact == "admin-remove-btn" && (
				<button
					className="thumbnail-btn"
					onClick={(e) => {
						e.preventDefault();
						removeRestaurant(id);
					}}
				>
					Remove
				</button>
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
						<Link to={`/restaurant-manager-update-menu/${id}`}>
							<button className="thumbnail-btn">Menu</button>
						</Link>
					) : (
						<button className="thumbnail-btn">Menu</button>
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
