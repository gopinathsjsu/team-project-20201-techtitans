import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar/Navbar";
import "./BookTablePage.css";

const BookTablePage = () => {
	const [searchCriteria, setSearchCriteria] = useState({
		date: "",
		time: "",
		people: 1,
		location: "",
	});
	const [allRestaurants, setAllRestaurants] = useState([]);
	const [searchResults, setSearchResults] = useState([]);
	const [visibleCount, setVisibleCount] = useState(5); // show first 5
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	// Initial load of all restaurants
	useEffect(() => {
		const fetchRestaurants = async () => {
			try {
				setLoading(true);
				const response = await axios.get(
					"http://127.0.0.1:5173/restaurants"
				);

				if (response.data) {
					const restaurantData = response.data.map((restaurant) => ({
						id: restaurant._id,
						name: restaurant.name,
						cuisineType: restaurant.cuisineType,
						costRating: restaurant.costRating,
						avgRating: restaurant.avgRating || 0,
						bookingsToday: restaurant.bookingsToday || 0,
						availableTimes: [
							"17:30",
							"18:00",
							"18:30",
							"19:00",
							"19:30",
						],
						image: restaurant.image || null, // optional image field
						address: restaurant.address || "", // used in search filtering
					}));

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
				// (Availability logic can be added here)
				return true;
			});

			setSearchResults(filteredResults);
			setVisibleCount(5); // reset visible count on new search
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

	const timeToMinutes = (time) => {
		if (!time) return 0;
		const [hours, minutes] = time.split(":").map(Number);
		return hours * 60 + minutes;
	};

	const getAvailableTimeSlots = (requestedTime, hours, bookingsToday) => {
		const slots = [];
		const maxBookings = 20;

		for (let offset = -30; offset <= 30; offset += 30) {
			const slotTime = requestedTime + offset;
			const hrs = Math.floor(slotTime / 60);
			const mins = slotTime % 60;
			const timeString = `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
			if (bookingsToday < maxBookings) {
				slots.push(timeString);
			}
		}
		return slots;
	};

	const handleLoadMore = () => {
		setVisibleCount((prev) => prev + 5);
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
									{result.availableTimes.map((time, idx) => (
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
