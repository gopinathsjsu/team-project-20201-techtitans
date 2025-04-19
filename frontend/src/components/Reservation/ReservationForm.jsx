import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import axios from "axios";
import "../../pages/Restaurant/Restaurant.css";

function ReservationForm(props) {
	const { restaurant } = props;
	const navigate = useNavigate();

	const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
	const [time, setTime] = useState("");
	const [table, setTable] = useState("");
	const [availableTables, setAvailableTables] = useState([]);
	const [people, setPeople] = useState("1");
	const [error, setError] = useState({});

	const restaurantClosedMsg =
		"Restaurant is closed on this day. Please choose another date.";
	const noTablesMsg =
		"There are no available tables at this time. Please choose another time.";

	function validate() {
		let bool = true;
		const errors = {};
		if (!time.length || time.length === 0 || time == restaurantClosedMsg) {
			errors.time = restaurantClosedMsg;
			bool = false;
		}
		if (table.length === 0 || table == noTablesMsg) {
			errors.table = noTablesMsg;
			bool = false;
		}
		setError(errors);
		return bool;
	}

	const handleReserveClick = () => {
		if (validate()) {
			navigate("/reservation-confirmation", {
				state: {
					restaurantName: restaurant?.name || "Restaurant",
					date,
					time,
					people,
					table,
				},
			});
		}
	};

	const generateTimeSlots = (hoursString) => {
		if (hoursString === "Closed") {
			return [restaurantClosedMsg];
		}
		try {
			const parseTime = (timeStr) => {
				const [time, period] = timeStr.split(" ");
				let [hours, minutes] = time.split(":").map(Number);
				if (minutes === undefined) minutes = 0;
				if (period === "PM" && hours !== 12) hours += 12;
				if (period === "AM" && hours === 12) hours = 0;
				return hours * 60 + minutes;
			};

			const [openTime, closeTime] = hoursString.split(" - ");
			const openMinutes = parseTime(openTime);
			const closeMinutes = parseTime(closeTime);
			const bookingDuration =
				parseInt(restaurant.bookingDuration.split(" ")[0], 10) * 60;

			const convertMinutesTo12Hour = (totalMinutes) => {
				const hrs24 = Math.floor(totalMinutes / 60);
				const mins = totalMinutes % 60;
				const period = hrs24 >= 12 ? "PM" : "AM";
				const hrs12 = hrs24 % 12 === 0 ? 12 : hrs24 % 12;
				return `${hrs12}:${mins.toString().padStart(2, "0")} ${period}`;
			};
			const slots = [];
			for (let t = openMinutes; t < closeMinutes; t += bookingDuration) {
				const slot =
					convertMinutesTo12Hour(t) +
					" - " +
					convertMinutesTo12Hour(t + bookingDuration);
				slots.push(slot);
			}
			return slots;
		} catch (error) {
			return [];
		}
	};

	const availableTimes = React.useMemo(() => {
		if (!restaurant || !restaurant.hours) {
			return [];
		}
		const fullDate = String(moment(date)._d);
		const dayOfWeek = fullDate.split(" ")[0];
		const hoursForDay = restaurant.hours[dayOfWeek] || "Closed";
		return generateTimeSlots(hoursForDay);
	}, [restaurant, date]);

	async function fetchTablesbyTime(time, people) {
		try {
			const response = await axios.get(
				`http://127.0.0.1:5000/table/${restaurant._id}/${time}/${people}`
			);
			return response.data;
		} catch (error) {
			return false;
		}
	}

	useEffect(() => {
		if (
			availableTimes.length > 0 &&
			availableTimes[0] !== restaurantClosedMsg
		) {
			if (!time) {
				setTime(availableTimes[0]);
			}
		} else {
			setTime("");
		}
	}, [availableTimes, time]);

	useEffect(() => {
		fetchTablesbyTime(time, people).then((result) => {
			if (!result || result.length == 0) {
				setAvailableTables([noTablesMsg]);
				setTable(availableTables[0]);
			} else {
				setAvailableTables(result);
				if (!table || table == noTablesMsg) {
					setTable(availableTables[0].tableNum);
				}
			}
		});
	}, [availableTables]);

	return (
		<div className="reservation-form">
			<h3>Make a reservation</h3>
			<div className="form-row">
				<div className="form-group">
					<label>No. of people</label>
					<input
						type="number"
						min="1"
						max="10"
						value={people}
						onChange={(e) => setPeople(e.target.value)}
					/>
				</div>
				<div className="form-group">
					<label>Date</label>
					<input
						type="date"
						value={date}
						onChange={(e) => setDate(e.target.value)}
					/>
				</div>
				<div className="form-group">
					<label>Time</label>
					<select
						name="time"
						value={time}
						onChange={(e) => setTime(e.target.value)}
					>
						{availableTimes.length === 0 ||
						(availableTimes.length === 1 &&
							availableTimes[0] === restaurantClosedMsg) ? (
							<option value="">{restaurantClosedMsg}</option>
						) : (
							availableTimes.map((slot, idx) => (
								<option key={idx} value={slot}>
									{slot}
								</option>
							))
						)}
					</select>
					{error.time && (
						<p style={{ color: "red" }}>Error: {error.time}</p>
					)}
				</div>
				<div className="form-group">
					<label>Table Selection</label>
					<select
						name="table"
						value={table}
						onChange={(e) => setTable(e.target.value)}
					>
						{availableTables.length === 0 ||
						(availableTables.length === 1 &&
							availableTables[0] === noTablesMsg) ? (
							<option value="">{noTablesMsg}</option>
						) : (
							availableTables.map((table_slot, idx) => (
								<option key={idx} value={table_slot.tableNum}>
									Table {table_slot.tableNum} - Seats{" "}
									{table_slot.seats}
								</option>
							))
						)}
					</select>
					{error.table && (
						<p style={{ color: "red" }}>Error: {error.table}</p>
					)}
				</div>
				<div className="form-group button-container">
					<button
						className="reserve-button"
						type="button"
						onClick={handleReserveClick}
					>
						Reserve
					</button>
				</div>
			</div>
		</div>
	);
}

export default ReservationForm;
