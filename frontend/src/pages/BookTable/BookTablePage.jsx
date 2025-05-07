import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar/Navbar";
import "./BookTablePage.css";

function useWindowSize() {
	const [windowSize, setWindowSize] = useState({
		width: window.innerWidth,
		height: window.innerHeight,
	});

	useEffect(() => {
		const handleResize = () => {
			setWindowSize({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		};

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return windowSize;
}

const getRoundedTime = (timeString) => {
	const [hour, minute] = timeString.split(":").map(Number);
	let roundedHour = hour;
	let roundedMinute = minute;

	if (minute === 0 || minute === 30) {
		roundedMinute = minute;
	} else if (minute < 30) {
		roundedMinute = 30;
	} else {
		roundedMinute = 0;
		roundedHour = (hour + 1) % 24;
	}

	return `${roundedHour.toString().padStart(2, "0")}:${roundedMinute
		.toString()
		.padStart(2, "0")}`;
};

const BookTablePage = () => {
	const { width } = useWindowSize();

	const [visibleCount, setVisibleCount] = useState(5);
	useEffect(() => {
		const columns = Math.max(Math.floor(width / 320), 1);
		const rows = 2;
		setVisibleCount(columns * rows);
	}, [width]);

	// Include tableSizes in the search criteria (number of people is used below)
	const [searchCriteria, setSearchCriteria] = useState({
		date: new Date().toISOString().split("T")[0],
		time: getRoundedTime(new Date().toTimeString().slice(0, 5)),
		people: 1,
		location: "",
	});
	const [allRestaurants, setAllRestaurants] = useState([]);
	const [searchResults, setSearchResults] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	// Converts a 24-hour time string to 12-hour format
	const convertTo12Hour = (timeString) => {
		let [hour, minute] = timeString.split(":").map(Number);
		const period = hour >= 12 ? "PM" : "AM";
		hour = hour % 12;
		if (hour === 0) hour = 12;
		return `${hour}:${minute.toString().padStart(2, "0")} ${period}`;
	};

	// Generates 30-minute time slots from an hours string (e.g., "11 AM - 11 PM")
	const generateTimeSlots = (hoursString) => {
		if (hoursString === "Closed") {
			return ["Restaurant is Closed"];
		}
		try {
			const [openTime, closeTime] = hoursString.split(" - ");

			const parseTime = (timeStr) => {
				const [time, period] = timeStr.split(" ");
				let [hours, minutes] = time.split(":").map(Number);
				if (minutes === undefined) minutes = 0;
				if (period === "PM" && hours !== 12) hours += 12;
				if (period === "AM" && hours === 12) hours = 0;
				return hours * 60 + minutes;
			};

			const openMinutes = parseTime(openTime);
			const closeMinutes = parseTime(closeTime);

			const convertMinutesTo12Hour = (totalMinutes) => {
				const hrs24 = Math.floor(totalMinutes / 60);
				const mins = totalMinutes % 60;
				const period = hrs24 >= 12 ? "PM" : "AM";
				const hrs12 = hrs24 % 12 === 0 ? 12 : hrs24 % 12;
				return `${hrs12}:${mins.toString().padStart(2, "0")} ${period}`;
			};

			const slots = [];
			for (let time = openMinutes; time < closeMinutes; time += 30) {
				slots.push(convertMinutesTo12Hour(time));
			}
			return slots;
		} catch (error) {
			console.error("Error generating time slots:", error);
			return [];
		}
	};

	useEffect(() => {
		const fetchRestaurants = async () => {
			try {
				setLoading(true);
				const response = await axios.get(
					"http://127.0.0.1:5000/restaurants"
				);
				if (response.data) {
					const restaurantData = response.data.map((restaurant) => {
						const days = [
							"Sun",
							"Mon",
							"Tue",
							"Wed",
							"Thu",
							"Fri",
							"Sat",
						];
						// Use today's day for the initial load
						const currentDay = days[new Date().getDay()];
						const hours =
							restaurant.hours[currentDay] ||
							Object.values(restaurant.hours)[0] ||
							"Closed";
						const availableTimes = generateTimeSlots(hours);

						return {
							id: restaurant._id,
							name: restaurant.name,
							cuisineType: restaurant.cuisineType,
							costRating: restaurant.costRating,
							avgRating: restaurant.avgRating || 0,
							bookingsToday: restaurant.bookingsToday || 0,
							hours: restaurant.hours, // keep raw hours data for filtering
							availableTimes, // initial available times (for today)
							image: restaurant.image || null,
							address: restaurant.address || "",
							tableSizes: restaurant.tableSizes, // include capacity info
						};
					});
					setAllRestaurants(restaurantData);
					setSearchResults(restaurantData);
				}
			} catch (err) {
				setError("Failed to load restaurants. Please try again.");
			} finally {
				setLoading(false);
			}
		};

		fetchRestaurants();
	}, []);

	// The updated search function recalculates available times based on the selected date
	// and filters by the rounded time and capacity (number of people).
	const handleSearch = async () => {
		try {
			setLoading(true);
			const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
			const searchDate = new Date(searchCriteria.date);
			const dayOfWeek = days[searchDate.getDay()];

			// Round the input time and convert it to 12-hour format for comparison
			const roundedTime = getRoundedTime(searchCriteria.time);
			const formattedSearchTime = convertTo12Hour(roundedTime);

			// Recalculate available times using the selected day, then filter by time slot and capacity.
			const filteredResults = allRestaurants
				.map((restaurant) => {
					const hoursForDay = restaurant.hours[dayOfWeek];
					if (!hoursForDay || hoursForDay === "Closed") {
						return {
							...restaurant,
							availableTimes: ["Restaurant is Closed"],
						};
					}
					const availableTimes = generateTimeSlots(hoursForDay);
					return { ...restaurant, availableTimes };
				})
				.filter((restaurant) => {
					// Exclude if restaurant is closed on that day.
					if (
						restaurant.availableTimes.includes(
							"Restaurant is Closed"
						)
					)
						return false;
					// Check capacity: at least one table should have seats >= the requested people.
					if (restaurant.tableSizes) {
						let capacityMatches = false;
						for (let [size] of Object.entries(
							restaurant.tableSizes
						)) {
							if (Number(size) >= searchCriteria.people) {
								capacityMatches = true;
								break;
							}
						}
						if (!capacityMatches) return false;
					}
					if (
						!restaurant.availableTimes.includes(formattedSearchTime)
					) {
						return false;
					}
					return true;
				});

			setSearchResults(filteredResults);
			setError(null);
		} catch (err) {
			setError("Error searching restaurants: " + err.message);
		} finally {
			setLoading(false);
		}
	};

	/*
	const handleTimeSlotClick = (restaurantId, time) => {
		navigate(`/reservation-confirmation`, {
			state: {
				restaurantId,
				date: searchCriteria.date,
				time,
				people: searchCriteria.people,
			},
		});
	};
	*/

	const handleLoadMore = () => {
		setVisibleCount((prev) => prev + visibleCount);
	};

	if (loading) {
		return (
			<div className="book-table-page">
				<Navbar role="customer" />
				<div className="loading-state">
					<p>Loading restaurants...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="book-table-page">
				<Navbar role="customer" />
				<div className="error-state">
					<p>{error}</p>
					<button onClick={handleSearch}>Retry</button>
				</div>
			</div>
		);
	}

	return (
		<div className="book-table-page">
			<Navbar role="customer" />
			<div className="search-section">
				<h1>Find your perfect dining experience</h1>
				<div className="search-form">
					<input
						type="date"
						value={searchCriteria.date}
						min={new Date().toISOString().split("T")[0]}
						onChange={(e) =>
							setSearchCriteria({
								...searchCriteria,
								date: e.target.value,
							})
						}
					/>
					<input
						type="time"
						value={searchCriteria.time}
						onChange={(e) =>
							setSearchCriteria({
								...searchCriteria,
								time: e.target.value,
							})
						}
					/>
					<input
						type="number"
						min="1"
						max="10"
						value={searchCriteria.people}
						onChange={(e) =>
							setSearchCriteria({
								...searchCriteria,
								people: parseInt(e.target.value),
							})
						}
						placeholder="Number of people"
					/>
					<input
						type="text"
						value={searchCriteria.location}
						onChange={(e) =>
							setSearchCriteria({
								...searchCriteria,
								location: e.target.value,
							})
						}
						placeholder="City, State or Zip code"
					/>
					<button onClick={handleSearch}>Find Restaurants</button>
				</div>
			</div>

			<div className="search-results">
				{searchResults.length === 0 ? (
					<div className="no-results">
						<h2>
							Oops! We don't have any restaurants available for
							the chosen slot.
						</h2>
						<h2>
							Try adjusting your search criteria or selecting a
							different time/date.
						</h2>
					</div>
				) : (
					searchResults.slice(0, visibleCount).map((result) => (
						<div key={result.id} className="restaurant-result">
							<img
								src={
									result.image ||
									"/images/default-restaurant.jpg"
								}
								alt={result.name}
								className="restaurant-image"
							/>
							<div className="restaurant-content">
								<h3>{result.name}</h3>
								<div className="restaurant-info">
									<p>🍴 {result.cuisineType}</p>
									<p>💰 {result.costRating}</p>
									<p>⭐ {result.avgRating.toFixed(1)}</p>
									<p>📊 {result.bookingsToday} today</p>
								</div>
								<div className="available-times">
									<p>Available times:</p>
									<div className="time-slots">
										{result.availableTimes.length === 1 &&
										result.availableTimes[0] ===
											"Restaurant is Closed" ? (
											<p>Restaurant is Closed</p>
										) : (
											<>
												{(() => {
													const selectedTime =
														convertTo12Hour(
															getRoundedTime(
																searchCriteria.time
															)
														);
													const index =
														result.availableTimes.indexOf(
															selectedTime
														);
													if (index === -1)
														return null;

													// Show a few slots near the searched time
													const start = Math.max(
														0,
														index - 2
													);
													const visibleSlots =
														result.availableTimes.slice(
															start,
															index + 1
														);

													return visibleSlots.map(
														(time, idx) => (
															<span
																key={idx}
																className="time-slot-display"
															>
																{time}
															</span>
														)
													);
												})()}
												{result.availableTimes.length >
													5}
											</>
										)}
									</div>
								</div>
								<Link to={`/restaurant/${result.id}`}>
									<button className="view-details-button">
										View Restaurant Details
									</button>
								</Link>
							</div>
						</div>
					))
				)}
			</div>

			{visibleCount < searchResults.length && (
				<div className="load-more-container">
					<button
						className="load-more-button"
						onClick={handleLoadMore}
					>
						Load More
					</button>
				</div>
			)}
		</div>
	);
};

export default BookTablePage;
