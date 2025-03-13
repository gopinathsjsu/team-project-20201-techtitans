import "./AddRestaurant.css";
import { useState } from "react";

function AddRestaurant() {
	const [closedDays, setClosedDays] = useState({
		sunday: false,
		monday: false,
		tuesday: false,
		wednesday: false,
		thursday: false,
		friday: false,
		saturday: false,
	});

	const [numTables, setNumTables] = useState(0);

	const handleCheckboxChange = (day) => {
		setClosedDays((prev) => ({
			...prev,
			[day]: !prev[day],
		}));
	};

	const days = [
		"sunday",
		"monday",
		"tuesday",
		"wednesday",
		"thursday",
		"friday",
		"saturday",
	];

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
			<label key={`table-${i + 1}`} className="form-group-table-sizes">
				Size for Table {i + 1}:
				<select
					name={`size-table-${i + 1}`}
					className="form-select-smallest"
				>
					<option value="" disabled selected>
						0
					</option>
					{tableSizeOptions}
				</select>
			</label>
		));
	};

	return (
		<>
			<h2>New Restaurant</h2>
			<form>
				<div className="restaurant-form">
					<label className="form-group">
						Name:
						<input
							type="text"
							name="name"
							placeholder="Enter Name..."
						/>
					</label>
					<label className="form-group">
						Address:
						<input
							type="text"
							name="address"
							placeholder="Enter Address..."
						/>
					</label>
					<label className="form-group">
						Phone Number:
						<input
							type="text"
							name="phone-number"
							placeholder="Enter Phone Number..."
						/>
					</label>
					<label className="form-group">
						Email:
						<input
							type="text"
							name="email"
							placeholder="Enter Email..."
						/>
					</label>
					<label className="form-group">
						Cuisine Type:
						<select name="cuisine-type" className="form-select">
							<option value="" disabled selected>
								Choose Cuisine Type...
							</option>
							<option value="american">American</option>
							<option value="chinese">Chinese</option>
							<option value="ethiopian">Ethiopian</option>
							<option value="french">French</option>
							<option value="fusion">Fusion</option>
							<option value="indian">Indian</option>
							<option value="italian">Italian</option>
							<option value="japanese">Japanese</option>
							<option value="korean">Korean</option>
							<option value="pakistani">Pakistani</option>
							<option value="mexican">Mexican</option>
							<option value="spanish">Spanish</option>
							<option value="thai">Thai</option>
							<option value="turkish">Turkish</option>
							<option value="vietnamese">Vietnamese</option>
							<option value="other">Other</option>
						</select>
					</label>
					<label className="form-group">
						Cost Rating:
						<select
							name="cost-rating"
							className="form-select-smaller"
						>
							<option value="" disabled selected>
								Choose Cost Rating...
							</option>
							<option value="low">$</option>
							<option value="medium">$$</option>
							<option value="high">$$$</option>
						</select>
					</label>
					<label className="form-group-description">
						Description:
						<textarea
							type="text"
							name="description"
							className="description-text"
							placeholder="Enter a description..."
						></textarea>
					</label>
					<label className="form-section-label">Hours</label>
					<div className="form-group-hours">
						{days.map((day) => (
							<div key={day} className="day">
								<label className="day-closed">
									<label className="day-title">
										{day.charAt(0).toUpperCase() +
											day.slice(1)}
										:
									</label>
									<label>
										Closed:
										<input
											type="checkbox"
											name={`closed-${day}`}
											checked={closedDays[day]}
											onChange={() =>
												handleCheckboxChange(day)
											}
										/>
									</label>
								</label>
								{!closedDays[day] && (
									<label className="from-to-hours">
										<label>From:</label>
										<select name={`${day}-start-time`}>
											<option value="" disabled selected>
												00:00 AM
											</option>
											<option value="12am">
												12:00 AM
											</option>
											<option value="1am">1:00 AM</option>
											<option value="2am">2:00 AM</option>
											<option value="3am">3:00 AM</option>
											<option value="4am">4:00 AM</option>
											<option value="5am">5:00 AM</option>
											<option value="6am">6:00 AM</option>
											<option value="7am">7:00 AM</option>
											<option value="8am">8:00 AM</option>
											<option value="9am">9:00 AM</option>
											<option value="10am">
												10:00 AM
											</option>
											<option value="11am">
												11:00 AM
											</option>
											<option value="12pm">
												12:00 PM
											</option>
											<option value="1pm">1:00 PM</option>
											<option value="2pm">2:00 PM</option>
											<option value="3pm">3:00 PM</option>
											<option value="4pm">4:00 PM</option>
											<option value="5pm">5:00 PM</option>
											<option value="6pm">6:00 PM</option>
											<option value="7pm">7:00 PM</option>
											<option value="8pm">8:00 PM</option>
											<option value="9pm">9:00 PM</option>
											<option value="10pm">
												10:00 PM
											</option>
											<option value="11pm">
												11:00 PM
											</option>
										</select>
										<label>To:</label>
										<select name={`${day}-end-time`}>
											<option value="" disabled selected>
												00:00 PM
											</option>
											<option value="12pm">
												12:00 PM
											</option>
											<option value="1pm">1:00 PM</option>
											<option value="2pm">2:00 PM</option>
											<option value="3pm">3:00 PM</option>
											<option value="4pm">4:00 PM</option>
											<option value="5pm">5:00 PM</option>
											<option value="6pm">6:00 PM</option>
											<option value="7pm">7:00 PM</option>
											<option value="8pm">8:00 PM</option>
											<option value="9pm">9:00 PM</option>
											<option value="10pm">
												10:00 PM
											</option>
											<option value="11pm">
												11:00 PM
											</option>
											<option value="12am">
												12:00 AM
											</option>
											<option value="1am">1:00 AM</option>
											<option value="2am">2:00 AM</option>
											<option value="3am">3:00 AM</option>
											<option value="4am">4:00 AM</option>
											<option value="5am">5:00 AM</option>
											<option value="6am">6:00 AM</option>
											<option value="7am">7:00 AM</option>
											<option value="8am">8:00 AM</option>
											<option value="9am">9:00 AM</option>
											<option value="10am">
												10:00 AM
											</option>
											<option value="11am">
												11:00 AM
											</option>
										</select>
									</label>
								)}
							</div>
						))}
					</div>
					<label className="form-group-booking">
						<label className="booking-times-title">
							Booking Times:
						</label>
						<label>From:</label>
						<select name="start-booking-time">
							<option value="" disabled selected>
								00:00 AM
							</option>
							<option value="12am">12:00 AM</option>
							<option value="1am">1:00 AM</option>
							<option value="2am">2:00 AM</option>
							<option value="3am">3:00 AM</option>
							<option value="4am">4:00 AM</option>
							<option value="5am">5:00 AM</option>
							<option value="6am">6:00 AM</option>
							<option value="7am">7:00 AM</option>
							<option value="8am">8:00 AM</option>
							<option value="9am">9:00 AM</option>
							<option value="10am">10:00 AM</option>
							<option value="11am">11:00 AM</option>
							<option value="12pm">12:00 PM</option>
							<option value="1pm">1:00 PM</option>
							<option value="2pm">2:00 PM</option>
							<option value="3pm">3:00 PM</option>
							<option value="4pm">4:00 PM</option>
							<option value="5pm">5:00 PM</option>
							<option value="6pm">6:00 PM</option>
							<option value="7pm">7:00 PM</option>
							<option value="8pm">8:00 PM</option>
							<option value="9pm">9:00 PM</option>
							<option value="10pm">10:00 PM</option>
							<option value="11pm">11:00 PM</option>
						</select>
						<label>To:</label>
						<select name="end-booking-time">
							<option value="" disabled selected>
								00:00 PM
							</option>
							<option value="12pm">12:00 PM</option>
							<option value="1pm">1:00 PM</option>
							<option value="2pm">2:00 PM</option>
							<option value="3pm">3:00 PM</option>
							<option value="4pm">4:00 PM</option>
							<option value="5pm">5:00 PM</option>
							<option value="6pm">6:00 PM</option>
							<option value="7pm">7:00 PM</option>
							<option value="8pm">8:00 PM</option>
							<option value="9pm">9:00 PM</option>
							<option value="10pm">10:00 PM</option>
							<option value="11pm">11:00 PM</option>
							<option value="12am">12:00 AM</option>
							<option value="1am">1:00 AM</option>
							<option value="2am">2:00 AM</option>
							<option value="3am">3:00 AM</option>
							<option value="4am">4:00 AM</option>
							<option value="5am">5:00 AM</option>
							<option value="6am">6:00 AM</option>
							<option value="7am">7:00 AM</option>
							<option value="8am">8:00 AM</option>
							<option value="9am">9:00 AM</option>
							<option value="10am">10:00 AM</option>
							<option value="11am">11:00 AM</option>
						</select>
						<label>Every</label>
						<select name="booking-time-minutes">
							<option value="" disabled selected>
								0 Minutes
							</option>
							<option value="10min">10 Minutes</option>
							<option value="20min">20 Minutes</option>
							<option value="30min">30 Minutes</option>
						</select>
					</label>
					<label className="form-section-label">Table Sizes</label>
					<label className="form-group">
						Number of Tables:
						<select
							name="total-tables"
							onChange={handleTableChange}
							className="form-select-smallest"
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
					<button className="save-btn">Save</button>
				</div>
			</form>
		</>
	);
}

export default AddRestaurant;
