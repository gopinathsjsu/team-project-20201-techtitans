import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar/Navbar";
import "./BookTablePage.css";

const BookTablePage = () => {
	const [date, setDate] = useState("");
	const [time, setTime] = useState("");
	const [people, setPeople] = useState(1);
	const [searchText, setSearchText] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const [allRestaurants, setAllRestaurants] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// Fetch all restaurants when component mounts
	useEffect(() => {
		let isMounted = true;
		const controller = new AbortController();

		const fetchRestaurants = async () => {
			try {
				setLoading(true);
				const response = await axios.get("/restaurants", {
					signal: controller.signal,
					timeout: 5000,
					headers: {
						"Cache-Control": "no-cache",
						Pragma: "no-cache",
						Expires: "0",
					},
				});

				if (isMounted && response.data) {
					const restaurantData = response.data.map((restaurant) => ({
						id: restaurant._id,
						name: restaurant.name,
						cuisineType: restaurant.cuisineType,
						costRating: restaurant.costRating,
						avgRating: restaurant.avgRating,
						times: ["17:30", "18:00", "18:30", "19:00", "19:30"],
					}));

					setAllRestaurants(restaurantData);
					setSearchResults(restaurantData);
				}
			} catch (err) {
				if (isMounted) {
					console.error("Error fetching restaurants:", err);
					setError(
						err.code === "ECONNABORTED"
							? "Connection timeout - please try again"
							: `Failed to load restaurants: ${err.message}`
					);
				}
			} finally {
				if (isMounted) {
					setLoading(false);
				}
			}
		};

		fetchRestaurants();

		return () => {
			isMounted = false;
			controller.abort();
		};
	}, []);

	const handleSearch = () => {
		// In a real application, you would send the search parameters to the backend
		// For now, we'll filter the existing restaurants based on the search text
		if (!searchText.trim()) {
			setSearchResults(allRestaurants);
			return;
		}

		const filteredResults = allRestaurants.filter(
			(restaurant) =>
				restaurant.name
					.toLowerCase()
					.includes(searchText.toLowerCase()) ||
				restaurant.cuisineType
					.toLowerCase()
					.includes(searchText.toLowerCase())
		);

		setSearchResults(filteredResults);
	};

	// Add loading state UI
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

	// Add error state UI
	if (error) {
		return (
			<div className="book-table-page">
				<Navbar role="customer" />
				<div className="error-state">
					<p>{error}</p>
					<button onClick={fetchRestaurants}>Retry</button>
				</div>
			</div>
		);
	}

	return (
		<div className="book-table-page">
			<Navbar role="customer" />
			<div className="search-form">
				<input
					type="date"
					value={date}
					onChange={(e) => setDate(e.target.value)}
				/>
				<input
					type="time"
					value={time}
					onChange={(e) => setTime(e.target.value)}
				/>
				<input
					type="number"
					min="1"
					max="10"
					value={people}
					onChange={(e) => setPeople(e.target.value)}
					placeholder="Number of people"
				/>
				<input
					type="text"
					value={searchText}
					onChange={(e) => setSearchText(e.target.value)}
					placeholder="Search for restaurant"
				/>
				<button onClick={handleSearch}>Search</button>
			</div>
			<div className="search-results">
				<h2>Search Results</h2>
				{loading ? (
					<p>Loading restaurants...</p>
				) : error ? (
					<p className="error-message">{error}</p>
				) : searchResults.length === 0 ? (
					<p>No restaurants found matching your search criteria.</p>
				) : (
					searchResults.map((result) => (
						<div key={result.id} className="restaurant-result">
							<h3>{result.name}</h3>
							<p>Cuisine: {result.cuisineType}</p>
							<p>Price: {result.costRating}</p>
							<p>Rating: {result.avgRating} ⭐</p>
							<div className="available-times">
								<p>Available times:</p>
								{result.times.map((time, idx) => (
									<button key={idx}>{time}</button>
								))}
							</div>
							<Link to={`/restaurant/${result.id}`}>
								<button>View Restaurant</button>
							</Link>
						</div>
					))
				)}
			</div>
		</div>
	);
};

export default BookTablePage;
