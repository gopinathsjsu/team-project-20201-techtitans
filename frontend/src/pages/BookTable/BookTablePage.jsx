import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar/Navbar";
import "./BookTablePage.css";

// Custom hook to track window size
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

const BookTablePage = () => {
	const { width } = useWindowSize();

	// Dynamically calculate the number of visible cards
	const [visibleCount, setVisibleCount] = useState(5);

	// Update visibleCount based on screen width
	useEffect(() => {
		// Assume each card needs a minimum width of 300px plus around 20px for gap/margin
		// This example uses 320px total per card.
		const columns = Math.max(Math.floor(width / 320), 1);
		const rows = 2; // Set the number of rows you want visible by default
		setVisibleCount(columns * rows);
	}, [width]);

	const [searchCriteria, setSearchCriteria] = useState({
		date: new Date().toISOString().split("T")[0],
		time: new Date().toTimeString().slice(0, 5),
		people: 1,
		location: "",
	});
	const [allRestaurants, setAllRestaurants] = useState([]);
	const [searchResults, setSearchResults] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchRestaurants = async () => {
			try {
				setLoading(true);
				const response = await axios.get(
					"http://127.0.0.1:5173/restaurants"
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
							availableTimes,
							image: restaurant.image || null,
							address: restaurant.address || "",
							hours: restaurant.hours,
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

	// Helper function to generate time slots from hours string
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

			const convertTo12Hour = (totalMinutes) => {
				const hrs24 = Math.floor(totalMinutes / 60);
				const mins = totalMinutes % 60;
				const period = hrs24 >= 12 ? "PM" : "AM";
				const hrs12 = hrs24 % 12 === 0 ? 12 : hrs24 % 12;
				return `${hrs12}:${mins.toString().padStart(2, "0")} ${period}`;
			};

			const slots = [];
			for (let time = openMinutes; time < closeMinutes; time += 30) {
				slots.push(convertTo12Hour(time));
			}
			return slots;
		} catch (error) {
			console.error("Error generating time slots:", error);
			return [];
		}
	};

	const handleSearch = async () => {
		if (
			!searchCriteria.date ||
			!searchCriteria.time ||
			!searchCriteria.people
		) {
			setError("Please fill in all required fields");
			return;
		}
		try {
			setLoading(true);
			const filteredResults = allRestaurants.filter((restaurant) => {
				if (
					searchCriteria.location &&
					!restaurant.address
						.toLowerCase()
						.includes(searchCriteria.location.toLowerCase())
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

	const handleLoadMore = () => {
		setVisibleCount((prev) => prev + visibleCount); // Load one “page” worth of new items
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
				{searchResults.slice(0, visibleCount).map((result) => (
					<div key={result.id} className="restaurant-result">
						<img
							src={
								result.image || "/images/default-restaurant.jpg"
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
											{result.availableTimes
												.slice(0, 5)
												.map((time, idx) => (
													<button
														key={idx}
														onClick={() =>
															handleTimeSlotClick(
																result.id,
																time
															)
														}
														className="time-slot-button"
													>
														{time}
													</button>
												))}
											{result.availableTimes.length >
												5 && (
												<span className="more-slots-indicator">
													...
												</span>
											)}
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
				))}
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
