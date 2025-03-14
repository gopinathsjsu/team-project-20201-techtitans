import "./RestaurantReservationConfirmation.css";
import { useState } from "react";

function RestaurantReservationConfirmation(props) {
	const handleFormSubmit = (event) => {
		//Should use props.date, props.time, props.numPeople to make reservation
		event.preventDefault();
	};

	//Returns array that holds dates from now to 7 days from now
	//Restaurant booking limits state that customers can make reservations at
	//most 7 days in advance
	const getSevenDatesAhead = () => {
		let eightDates = [];
		const date = new Date();
		eightDates.push(date.toLocaleDateString());
		for (let i = 0; i < 7; i++) {
			date.setDate(date.getDate() + 1);
			eightDates.push(date.toLocaleDateString());
		}
		return eightDates;
	};

	const [dateSelection, setDateSelection] = useState("");

	const handleDateSelection = (e) => {
		setDateSelection(e.target.value);
	};

	//Returns array that holds available booking times based on restaurants booking hours,
	//If customer chooses today's date, then hours will adjust since restaurant booking
	//limits state that customers must make reservations at least 4 hours in advance
	//Unfortunately this function does not account for other customers' reservations
	const getBookingTimes = () => {
		let bookingTimes = [];
		const startTime = props.bookingStartTime; //ex. bookingStartTime = "9:00 AM"
		const endTime = props.bookingEndTime; //ex. bookingEndTime = "9:00 PM"
		const intervals = parseInt(
			props.bookingTimeIntervals.replace(/[^\d]/g, ""),
			10
		);

		//Create start date with booking starting time (which is formatted like 9:00 AM)
		const [startingTime, startingPeriod] = startTime.split(" ");
		let [startHours, startMinutes] = startingTime.split(":").map(Number);
		if (startingPeriod.toLowerCase() === "pm" && startHours !== 12) {
			startHours += 12;
		} else if (startingPeriod.toLowerCase() === "am" && startHours === 12) {
			startHours = 0;
		}
		const startDate = new Date();
		startDate.setHours(startHours, startMinutes);

		//Create end date with booking end time (which is formatted like 9:00 PM)
		const [endingTime, endingPeriod] = endTime.split(" ");
		let [endHours, endMinutes] = endingTime.split(":").map(Number);
		if (endingPeriod.toLowerCase() === "pm" && endHours !== 12) {
			endHours += 12;
		} else if (endingPeriod.toLowerCase() === "am" && endHours === 12) {
			endHours = 0;
		}
		const endDate = new Date();
		endDate.setHours(endHours, endMinutes);

		//Checks if the date selected is today
		const today = new Date();
		const [currentMonth, currentDay, currentYear] = dateSelection
			.split("/")
			.map((num) => parseInt(num, 10));
		const selectedDate = new Date(
			currentYear,
			currentMonth - 1,
			currentDay
		);
		const sameDay =
			today.getFullYear() === selectedDate.getFullYear() &&
			today.getMonth() === selectedDate.getMonth() &&
			today.getDate() === selectedDate.getDate();
		if (sameDay) {
			const fourHoursAhead = new Date(today);
			fourHoursAhead.setHours(today.getHours() + 4);
			if (fourHoursAhead.getMinutes() > 0) {
				fourHoursAhead.setMinutes(0);
				fourHoursAhead.setHours(fourHoursAhead.getHours() + 1);
			}
			if (
				fourHoursAhead.getDate() !== today.getDate() ||
				fourHoursAhead.getTime() > endDate.getTime()
			) {
				return bookingTimes;
			} else if (fourHoursAhead.getTime() < startDate.getTime()) {
				bookingTimes.push(startTime);
			} else {
				startDate.setTime(fourHoursAhead.getTime());
				const adjustedHours = startDate.getHours() % 12 || 12;
				const adjustedMinutes = startDate
					.getMinutes()
					.toString()
					.padStart(2, "0");
				const adjustedPeriod = startDate.getHours() >= 12 ? "PM" : "AM";
				bookingTimes.push(
					`${adjustedHours}:${adjustedMinutes} ${adjustedPeriod}`
				);
			}
		} else {
			bookingTimes.push(startTime);
		}

		//Puts all available booking times into bookingTimes
		while (startDate.getTime() < endDate.getTime()) {
			startDate.setMinutes(startDate.getMinutes() + intervals);
			if (startDate.getTime() >= endDate.getTime()) {
				break;
			}
			const newHours = startDate.getHours() % 12 || 12;
			const newMinutes = startDate
				.getMinutes()
				.toString()
				.padStart(2, "0");
			const newPeriod = startDate.getHours() >= 12 ? "PM" : "AM";
			bookingTimes.push(`${newHours}:${newMinutes} ${newPeriod}`);
		}
		return bookingTimes;
	};

	return (
		<>
			<h2>{props.name}</h2>
			<form className="reservation-form" onSubmit={handleFormSubmit}>
				<div className="reservation-control">
					<label className="reservation-info">
						Date: {props.date}
						{/*
						<select
							className="reservation-selector"
							name="reservation-date"
							onChange={handleDateSelection}
						>
							<option value="" disabled selected>
								Choose Date...
							</option>
							{getSevenDatesAhead().map((date, index) => (
								<option key={index} value={date}>
									{date}
								</option>
							))}
						</select>
                        */}
					</label>
					<label className="reservation-info">
						Time: {props.time}
						{/*
						<select
							className="reservation-selector"
							name="reservation-time"
						>
							<option value="" disabled selected>
								Choose Time...
							</option>
							{getBookingTimes().map((time, index) => (
								<option key={index} value={time}>
									{time}
								</option>
							))}
						</select>
                        */}
					</label>
					<label className="reservation-info">
						Number of People: {props.numPeople}
						{/*
						<select
							className="reservation-selector"
							name="reservation-persons"
						>
							<option value="" disabled selected>
								0
							</option>
							{Array.from({ length: props.maxPeople }, (_, i) => (
								<option key={i + 1} value={i + 1}>
									{i + 1}
								</option>
							))}
						</select>
                        */}
					</label>
				</div>
				<button type="submit" className="complete-btn">
					Complete Reservation
				</button>
			</form>
		</>
	);
}

export default RestaurantReservationConfirmation;
