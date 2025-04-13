import "./AddRestaurant.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AlertMessage from "../AlertMessage";
import TimeSelect, { timeOptions } from "./TimeSelect";


function AddRestaurant() {
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
			<option key={i + 1} value={`${i + 1}-seats`}>
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
					name={`size-table-${i + 1}`}
					className="add-restaurant-form-select-smallest"
				>
					<option value="" disabled selected>
						0
					</option>
					{tableSizeOptions}
				</select>
			</label>
		));
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
	});

	/*
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
		bookingTimes: {
			From: "",
			To: "",
			Every: "",
		},
		tables: {},
	});
	*/

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
				"http://127.0.0.1:5173/restaurants",
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
						Phone Number:
						<input
							type="text"
							name="contactInfo"
							placeholder="Required Format: 123-456-7890"
							onChange={handleChange}
						/>
					</label>
					{/*
					<label className="add-restaurant-form-group">
						Email:
						<input
							type="text"
							name="email"
							placeholder="Enter Email..."
						/>
					</label>
					*/}
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
										<label>From:</label>

										<TimeSelect
											value={restaurant.hours[day]?.start || ""}
											onChange={(e) => handleTimeChange(day, "start", e.target.value)}
											placeholder="00:00"
										/>

										<label>To:</label>
										<TimeSelect
											value={restaurant.hours[day]?.start || ""}
											onChange={(e) => handleTimeChange(day, "start", e.target.value)}
											placeholder="00:00"
										/>
									</label>
								)}
							</div>
						))}
					</div>
					<label className="add-restaurant-form-group-booking">
						<label className="add-restaurant-booking-times-title">
							Booking Times:
						</label>
						<label>From:</label>
						<TimeSelect
							value={restaurant.bookingTimes?.From || ""}
							onChange={(e) =>
								setRestaurant((prev) => ({
									...prev,
									bookingTimes: {
										...prev.bookingTimes,
										From: e.target.value,
									},
								}))
							}
							placeholder="00:00"
						/>

						<label>To:</label>
						<TimeSelect
							value={restaurant.bookingTimes?.To || ""}
							onChange={(e) =>
								setRestaurant((prev) => ({
									...prev,
									bookingTimes: {
										...prev.bookingTimes,
										To: e.target.value,
									},
								}))
							}
							placeholder="00:00"
						/>

						<label>Every</label>
						<select
							value={restaurant.bookingTimes?.Every || ""}
							onChange={(e) =>
								setRestaurant((prev) => ({
									...prev,
									bookingTimes: {
										...prev.bookingTimes,
										Every: e.target.value,
									},
								}))
							}
						>
							<option value="" disabled>0 Minutes</option>
							{["10 Minutes", "20 Minutes", "30 Minutes"].map((interval) => (
								<option key={interval} value={interval}>{interval}</option>
							))}
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
					{error.name && (
						<p style={{ color: "red" }}>Error: {error.name}</p>
					)}
					{error.address && (
						<p style={{ color: "red" }}>Error: {error.address}</p>
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
