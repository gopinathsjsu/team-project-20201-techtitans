import "./AddRestaurant.css";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AlertMessage from "../AlertMessage";
import TimeSelect, { timeOptions } from "./TimeSelect";


function AddRestaurant(props) {
	const { userEmail } = props;
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
				className="add-restaurant-form-group-table-sizes"
			>
				Size for Table {i + 1}:
				<select
					name={`Table ${i + 1} Size`}
					className="add-restaurant-form-select-smallest"
					onChange={handleTableSizeChange}
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

	const [alertMessages, setAlertMessages] = useState({
		isOpen: false,
		message: "",
		type: "error",
	});
	const [error, setError] = useState({});
	const [isDisable, setDisable] = useState(false);
	const [restaurant, setRestaurant] = useState({
		name: "",
		cuisineType: "",
		costRating: "",
		avgRating: 0,
		bookingsToday: 0,
		address: "",
		contactInfo: "",
		hours: {
			Mon: "",
			Tue: "",
			Wed: "",
			Thu: "",
			Fri: "",
			Sat: "",
			Sun: "",
		},
		description: "",
		location: [0, 0],
		pendingApproval: true,
		approved: false,
		email: userEmail || "",
		tableSizes: {},
		bookingDuration: "",
		photos: [],
	});

	const handleLocationChange = (e) => {
		const { name, value } = e.target;
		const index = name === "latitude" ? 0 : 1;
		const newLocation = [...restaurant.location];
		newLocation[index] = parseFloat(value);
		setRestaurant((prev) => ({
			...prev,
			location: newLocation,
		}));
	};

	const fileInputRef = useRef(null);

	const handleImageInsert = async (e) => {
		const files = e.target.files;
		if (!files || files.length === 0) return;
		const uploadedUrls = [];
		for (let i = 0; i < Math.min(files.length, 5); i++) {
			const formData = new FormData();
			formData.append("image", files[i]);

			try {
				const res = await axios.post(
					"http://localhost:5000/upload",
					formData
				);
				uploadedUrls.push(res.data.fileUrl);
			} catch (err) {
				console.error("Error uploading image:", err);
			}
		}
		setRestaurant((prev) => ({
			...prev,
			photos: [...prev.photos, ...uploadedUrls].slice(0, 5),
		}));
	};

	const navigate = useNavigate();

	function handleChange(event) {
		const { value } = event.target;
		setRestaurant({
			...restaurant,
			[event.target.name]: value,
		});
	}

	function validate() {
		let bool = true;
		const errors = {};
		if (restaurant.email.length === 0) {
			errors.email =
				"Please wait until your email is synced to this restaurant.";
			bool = false;
		}
		if (!restaurant.photos || restaurant.photos.length === 0) {
			errors.photos = "Please upload at least one photo.";
			bool = false;
		}
		if (restaurant.name.length === 0) {
			errors.name = "Please enter a restaurant name.";
			bool = false;
		}
		if (restaurant.cuisineType === "") {
			errors.cuisineType = "Please choose a cuisine type.";
			bool = false;
		}
		if (restaurant.costRating === "") {
			errors.costRating = "Please choose a cost rating.";
			bool = false;
		}
		if (restaurant.address.length === 0) {
			errors.address = "Please enter an address.";
			bool = false;
		}
		const phonePattern = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/;
		if (restaurant.contactInfo.length === 0) {
			errors.contactInfo = "Please enter a phone number.";
			bool = false;
		} else if (!phonePattern.test(restaurant.contactInfo)) {
			errors.contactInfo =
				"Please enter a phone number in this format: 123-456-7890.";
			bool = false;
		}
		if (restaurant.description.length === 0) {
			errors.description = "Please enter a description.";
			bool = false;
		}
		if (
			isNaN(restaurant.location[0]) ||
			restaurant.location[0] < 37.1 ||
			restaurant.location[0] > 37.5
		) {
			errors.latitude =
				"Latitude must be between 37.1 and 37.5 (San Jose area).";
			bool = false;
		}
		if (
			isNaN(restaurant.location[1]) ||
			restaurant.location[1] < -122.1 ||
			restaurant.location[1] > -121.5
		) {
			errors.longitude =
				"Longitude must be between -122.1 and -121.5 (San Jose area).";
			bool = false;
		}
		if (restaurant.bookingDuration === "") {
			errors.bookingDuration = "Please choose a booking duration.";
			bool = false;
		}
		if (
			!restaurant.tableSizes ||
			Object.keys(restaurant.tableSizes).length === 0 ||
			Object.keys(restaurant.tableSizes).length !== numTables
		) {
			errors.tableSizes = "Please choose sizes for all tables.";
			bool = false;
		}
		let open = false;
		let hasErrors = false;
		const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
		daysOfWeek.forEach((day) => {
			const currentHours = (restaurant.hours[day] || "").trim();
			if (
				!currentHours ||
				currentHours === "" ||
				currentHours === "-" ||
				currentHours.startsWith("-") ||
				currentHours.endsWith("-")
			) {
				hasErrors = true;
			} else if (currentHours !== "Closed") {
				open = true;
			}
		});
		if (hasErrors) {
			errors.hours =
				"Please enter all operating hours for all days of the week.";
			bool = false;
		} else if (!open) {
			errors.hours = "Please have at least one day of the week open.";
			bool = false;
		}
		setError(errors);
		return bool;
	}

	async function makeRestaurantCall(restaurant) {
		try {
			const response = await axios.post(
				"http://127.0.0.1:5000/restaurants",
				restaurant
			);
			return response;
		} catch (error) {
			return error;
		}
	}

	function addRestaurant() {
		if (validate()) {
			setDisable(true);
			makeRestaurantCall(restaurant).then((result) => {
				if (result && result.status === 201) {
					navigate("/restaurant-manager-home");
					window.location.reload();
					setAlertMessages({
						isOpen: true,
						message:
							"Restaurant Successfully Added, waiting for Approval",
						type: "success",
					});
				} else if (result.response.status === 500) {
					setAlertMessages({
						isOpen: true,
						message: "Invalid input. Unable to add restaurant.",
						type: "error",
					});
				} else if (result.response.status === 401) {
					setAlertMessages({
						isOpen: true,
						message: "Restaurant already exists.",
						type: "error",
					});
				} else if (result.response.status === 400) {
					setAlertMessages({
						isOpen: true,
						message: result.response.data,
						type: "error",
					});
				}
			});
		}
	}

	return (
		<>
			<h2>New Restaurant</h2>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					if (!isDisable) {
						addRestaurant();
					}
				}}
			>
				<div className="add-restaurant-restaurant-form">
					<input
						type="file"
						multiple
						accept="image/*"
						onChange={handleImageInsert}
						style={{ display: "none" }}
						ref={fileInputRef}
					/>
					<button
						type="button"
						className="add-restaurant-insert-pics-btn"
						onClick={() => fileInputRef.current.click()}
					>
						Insert Images
					</button>
					{restaurant.photos.length > 0 && (
						<p style={{ color: "green", marginBottom: "10px" }}>
							{restaurant.photos.length}/5 photo
							{restaurant.photos.length > 1 ? "s" : ""} added. 👍
						</p>
					)}
					<label className="add-restaurant-form-group">
						Name:
						<input
							type="text"
							name="name"
							placeholder="Enter Name..."
							onChange={handleChange}
						/>
					</label>
					<label className="add-restaurant-form-group">
						Address:
						<input
							type="text"
							name="address"
							placeholder="Enter Address..."
							onChange={handleChange}
						/>
					</label>
					<label className="add-restaurant-form-group">
						Location:
						<div className="add-restaurant-form-coordinates">
							<input
								type="text"
								name="latitude"
								placeholder="Enter Latitude..."
								onChange={handleLocationChange}
							/>
							<input
								type="text"
								name="longitude"
								placeholder="Enter Longitude..."
								onChange={handleLocationChange}
							/>
						</div>
					</label>
					<label className="add-restaurant-form-group">
						Phone Number:
						<input
							type="text"
							name="contactInfo"
							placeholder="Required Format: 123-456-7890"
							onChange={handleChange}
						/>
					</label>
					<label className="add-restaurant-form-group">
						Cuisine Type:
						<select
							name="cuisineType"
							className="add-restaurant-form-select"
							onChange={handleChange}
						>
							<option value="" disabled selected>
								Choose Cuisine Type...
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
					<label className="add-restaurant-form-group">
						Cost Rating:
						<select
							name="costRating"
							className="add-restaurant-form-select-smaller"
							onChange={handleChange}
						>
							<option value="" disabled selected>
								Choose Cost Rating...
							</option>
							<option value="$">$</option>
							<option value="$$">$$</option>
							<option value="$$$">$$$</option>
						</select>
					</label>
					<label className="add-restaurant-form-group-description">
						Description:
						<textarea
							type="text"
							name="description"
							className="add-restaurant-description-text"
							placeholder="Enter a description..."
							onChange={handleChange}
						></textarea>
					</label>
					<label className="add-restaurant-form-section-label">
						Hours
					</label>
					<div className="add-restaurant-form-group-hours">
						{days.map((day) => (
							<div key={day} className="add-restaurant-day">
								<label className="add-restaurant-day-closed">
									<label className="add-restaurant-day-title">
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
									<label className="add-restaurant-from-to-hours">
										{!closedDays[day] && (
											<label className="add-restaurant-from-to-hours">
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
					<label className="add-restaurant-form-group">
						Booking Duration:
						<select
							name="bookingDuration"
							className="add-restaurant-form-select-smaller"
							onChange={handleChange}
						>
							<option value="" disabled selected>
								Choose Booking Duration...
							</option>
							<option value="1 Hour">1 Hour</option>
							<option value="2 Hours">2 Hours</option>
							<option value="3 Hours">3 Hours</option>
						</select>
					</label>
					<label className="add-restaurant-form-section-label">
						Table Sizes
					</label>
					<label className="add-restaurant-form-group">
						Number of Tables:
						<select
							name="total-tables"
							onChange={handleTableChange}
							className="add-restaurant-form-select-smallest"
						>
							<option value="" disabled selected>
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
					{error.email && (
						<p style={{ color: "red" }}>Error: {error.email}</p>
					)}
					{error.photos && (
						<p style={{ color: "red" }}>Error: {error.photos}</p>
					)}
					{error.name && (
						<p style={{ color: "red" }}>Error: {error.name}</p>
					)}
					{error.address && (
						<p style={{ color: "red" }}>Error: {error.address}</p>
					)}
					{error.latitude && (
						<p style={{ color: "red" }}>Error: {error.latitude}</p>
					)}
					{error.longitude && (
						<p style={{ color: "red" }}>Error: {error.longitude}</p>
					)}
					{error.contactInfo && (
						<p style={{ color: "red" }}>
							Error: {error.contactInfo}
						</p>
					)}
					{error.cuisineType && (
						<p style={{ color: "red" }}>
							Error: {error.cuisineType}
						</p>
					)}
					{error.costRating && (
						<p style={{ color: "red" }}>
							Error: {error.costRating}
						</p>
					)}
					{error.description && (
						<p style={{ color: "red" }}>
							Error: {error.description}
						</p>
					)}
					{error.hours && (
						<p style={{ color: "red" }}>Error: {error.hours}</p>
					)}
					{error.bookingDuration && (
						<p style={{ color: "red" }}>
							Error: {error.bookingDuration}
						</p>
					)}
					{error.tableSizes && (
						<p style={{ color: "red" }}>
							Error: {error.tableSizes}
						</p>
					)}
					<button className="add-restaurant-save-btn">Save</button>
					<AlertMessage
						alertMessages={alertMessages}
						setAlertMessages={setAlertMessages}
					/>
				</div>
			</form>
		</>
	);
}

export default AddRestaurant;
