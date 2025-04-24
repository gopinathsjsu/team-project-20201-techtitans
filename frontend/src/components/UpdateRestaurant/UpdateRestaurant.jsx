import "./UpdateRestaurant.css";
import { useState, useEffect } from "react";
import axios from "axios";

function UpdateRestaurant(props) {
	const { restaurantId } = props;
	const [restaurant, setRestaurant] = useState(null);

	useEffect(() => {
		const fetchRestaurant = async () => {
			try {
				setRestaurant(null);
				const response = await axios.get(
					`http://localhost:5000/restaurants/${restaurantId}`
				);
				if (response.data) {
					setRestaurant(response.data);
				} else {
					console.error("No restaurant data received");
				}
			} catch (error) {
				return false;
			}
		};
		if (restaurantId) {
			fetchRestaurant();
		}
	}, [restaurantId]);

	function handleChange(event) {}

	const handleLocationChange = (e) => {};

	if (!restaurant) {
		return (
			<>
				<h2>Loading Restaurant Details...</h2>
			</>
		);
	}

	return (
		<>
			<h2>Update Restaurant</h2>
			<form>
				<div className="update-restaurant-restaurant-form">
					<label className="update-restaurant-form-group">
						Name:
						<input
							type="text"
							name="name"
							placeholder={restaurant.name}
							onChange={handleChange}
						/>
					</label>
					<label className="update-restaurant-form-group">
						Address:
						<input
							type="text"
							name="address"
							placeholder={restaurant.address}
							onChange={handleChange}
						/>
					</label>
					<label className="update-restaurant-form-group">
						Location:
						<div className="update-restaurant-form-coordinates">
							<input
								type="text"
								name="latitude"
								placeholder={restaurant.location[0]}
								onChange={handleLocationChange}
							/>
							<input
								type="text"
								name="longitude"
								placeholder={restaurant.location[1]}
								onChange={handleLocationChange}
							/>
						</div>
					</label>
					<label className="update-restaurant-form-group">
						Phone Number:
						<input
							type="text"
							name="contactInfo"
							placeholder={restaurant.contactInfo}
							onChange={handleChange}
						/>
					</label>
					<label className="update-restaurant-form-group">
						Cuisine Type:
						<select
							name="cuisineType"
							className="update-restaurant-form-select"
							onChange={handleChange}
						>
							<option value="" disabled selected>
								{restaurant.cuisineType}
							</option>
							<option value="American">American</option>
							<option value="Chinese">Chinese</option>
							<option value="Ethiopian">Ethiopian</option>
							<option value="French">French</option>
							<option value="Fusion">Fusion</option>
							<option value="Indian">Indian</option>
							<option value="Italian">Italian</option>
							<option value="Japanese">Japanese</option>
							<option value="Korean">Korean</option>
							<option value="Pakistani">Pakistani</option>
							<option value="Mexican">Mexican</option>
							<option value="Spanish">Spanish</option>
							<option value="Thai">Thai</option>
							<option value="Turkish">Turkish</option>
							<option value="Vietnamese">Vietnamese</option>
							<option value="Other">Other</option>
						</select>
					</label>
					<label className="update-restaurant-form-group">
						Cost Rating:
						<select
							name="costRating"
							className="update-restaurant-form-select-smaller"
							onChange={handleChange}
						>
							<option value="" disabled selected>
								{restaurant.costRating}
							</option>
							<option value="$">$</option>
							<option value="$$">$$</option>
							<option value="$$$">$$$</option>
						</select>
					</label>
					<label className="update-restaurant-form-group-description">
						Description:
						<textarea
							type="text"
							name="description"
							className="update-restaurant-description-text"
							placeholder={restaurant.description}
							onChange={handleChange}
						></textarea>
					</label>
					<label className="update-restaurant-form-section-label">
						Hours
					</label>
					<label className="update-restaurant-form-group">
						Booking Duration:
						<select
							name="bookingDuration"
							className="update-restaurant-form-select-smaller"
							onChange={handleChange}
						>
							<option value="" disabled selected>
								{restaurant.bookingDuration}
							</option>
							<option value="1 Hour">1 Hour</option>
							<option value="2 Hours">2 Hours</option>
							<option value="3 Hours">3 Hours</option>
						</select>
					</label>
					<button className="update-restaurant-save-btn">Save</button>
				</div>
			</form>
		</>
	);
}

export default UpdateRestaurant;
