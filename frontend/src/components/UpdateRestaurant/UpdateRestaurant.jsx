import "./UpdateRestaurant.css";
import { useState, useEffect } from "react";
import axios from "axios";
import TimeSelect, { timeOptions } from "../TimeSelect";

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

	const [closedDays, setClosedDays] = useState({
		Sun: false,
		Mon: false,
		Tue: false,
		Wed: false,
		Thu: false,
		Fri: false,
		Sat: false,
	});

	const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

	const dayTitles = {
		Sun: "Sunday",
		Mon: "Monday",
		Tue: "Tuesday",
		Wed: "Wednesday",
		Thu: "Thursday",
		Fri: "Friday",
		Sat: "Saturday",
	};

	const handleTimeChange = (day, type, value) => {
		setRestaurant((prev) => {
			const newHours = { ...prev.hours };
			let currentHours = newHours[day]
				? newHours[day].split(" - ")
				: ["", ""];
			if (type === "start") {
				currentHours[0] = value;
			} else if (type === "end") {
				currentHours[1] = value;
			}
			newHours[day] = currentHours.join(" - ");
			return {
				...prev,
				hours: newHours,
			};
		});
	};

	const handleCheckboxChange = (day) => {
		setClosedDays((prev) => {
			const newClosedDays = { ...prev, [day]: !prev[day] };
			setRestaurant((prevRestaurant) => {
				const newHours = { ...prevRestaurant.hours };
				newHours[day] = newClosedDays[day] ? "Closed" : "";
				return {
					...prevRestaurant,
					hours: newHours,
				};
			});
			return newClosedDays;
		});
	};

	useEffect(() => {
		if (restaurant) {
			const newClosedDays = {};
			for (const day of days) {
				newClosedDays[day] = restaurant.hours?.[day] === "Closed";
			}
			setClosedDays(newClosedDays);
			const existingTableSizes = restaurant.tableSizes;
			setNumTables(Object.keys(existingTableSizes).length);
		}
	}, [restaurant]);

	const [numTables, setNumTables] = useState(0);

	const handleTableChange = (e) => {
		setNumTables(parseInt(e.target.value, 10));
	};

	const renderTableSizes = () => {
		const tableSizeOptions = Array.from({ length: 20 }, (_, i) => (
			<option key={i + 1} value={`${i + 1}`}>
				{i + 1}
			</option>
		));

		return Array.from({ length: numTables }, (_, i) => (
			<label
				key={`table-${i + 1}`}
				className="update-restaurant-form-group-table-sizes"
			>
				Size for Table {i + 1}:
				<select
					name={`Table ${i + 1} Size`}
					className="update-restaurant-form-select-smallest"
					onChange={handleTableSizeChange}
					value={restaurant.tableSizes?.[`Table ${i + 1} Size`] || ""}
				>
					<option value="" disabled selected>
						0
					</option>
					{tableSizeOptions}
				</select>
			</label>
		));
	};

	const handleTableSizeChange = (e) => {
		const { name, value } = e.target;
		setRestaurant((prev) => ({
			...prev,
			tableSizes: {
				...prev.tableSizes,
				[name]: value,
			},
		}));
	};

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
					<div className="update-restaurant-photos-preview">
						{restaurant.photos && restaurant.photos.length > 0 ? (
							restaurant.photos.map((photoUrl, index) => (
								<img
									key={index}
									src={photoUrl}
									alt={`Restaurant photo ${index + 1}`}
									className="update-restaurant-photo-thumbnail"
								/>
							))
						) : (
							<p>No photos uploaded.</p>
						)}
					</div>
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
					<div className="update-restaurant-form-group-hours">
						{days.map((day) => (
							<div key={day} className="update-restaurant-day">
								<label className="update-restaurant-day-closed">
									<label className="update-restaurant-day-title">
										{dayTitles[day]}:
									</label>
									<label>
										Closed:
										<input
											type="checkbox"
											checked={closedDays[day]}
											onChange={() =>
												handleCheckboxChange(day)
											}
										/>
									</label>
								</label>
								{!closedDays[day] && (
									<label className="update-restaurant-from-to-hours">
										{!closedDays[day] && (
											<label className="update-restaurant-from-to-hours">
												<label>From:</label>
												<TimeSelect
													value={
														restaurant.hours[day]
															? restaurant.hours[
																	day
																]
																	.split(
																		" - "
																	)[0]
																	.trim()
															: ""
													}
													onChange={(e) =>
														handleTimeChange(
															day,
															"start",
															e.target.value
														)
													}
													placeholder="00:00"
												/>

												<label>To:</label>
												<TimeSelect
													value={
														restaurant.hours[day]
															? restaurant.hours[
																	day
																]
																	.split(
																		" - "
																	)[1]
																	?.trim() ||
																""
															: ""
													}
													onChange={(e) =>
														handleTimeChange(
															day,
															"end",
															e.target.value
														)
													}
													placeholder="00:00"
												/>
											</label>
										)}
									</label>
								)}
							</div>
						))}
					</div>
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
					<label className="update-restaurant-form-section-label">
						Table Sizes
					</label>
					<label className="update-restaurant-form-group">
						Number of Tables:
						<select
							name="total-tables"
							onChange={handleTableChange}
							className="update-restaurant-form-select-smallest"
							value={numTables}
						>
							<option value="0" disabled selected>
								0
							</option>
							{Array.from({ length: 20 }, (_, i) => (
								<option key={i + 1} value={i + 1}>
									{i + 1}
								</option>
							))}
						</select>
					</label>
					{renderTableSizes()}
				</div>
			</form>
		</>
	);
}

export default UpdateRestaurant;
