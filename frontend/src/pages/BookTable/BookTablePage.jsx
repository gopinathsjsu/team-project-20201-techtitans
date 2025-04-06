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
        const fetchRestaurants = async () => {
            try {
                setLoading(true);
                const response = await axios.get("/restaurants"); // Remove hardcoded localhost:5173
                
                if (response.data) {
                    // Transform the data into the format needed for display
                    const restaurantData = response.data.map(restaurant => ({
                        id: restaurant._id,
                        name: restaurant.name,
                        cuisineType: restaurant.cuisineType,
                        costRating: restaurant.costRating,
                        avgRating: restaurant.avgRating,
                        // Generate sample available times (this should come from your backend in production)
                        times: ["17:30", "18:00", "18:30", "19:00", "19:30"]
                    }));
                    
                    setAllRestaurants(restaurantData);
                    setSearchResults(restaurantData); // Initially show all restaurants
                }
                setLoading(false);
            } catch (err) {
                console.error("Error fetching restaurants:", err);
                setError("Failed to load restaurants. Please try again later.");
                setLoading(false);
            }
        };

        fetchRestaurants();
    }, []);

    const handleSearch = () => {
        // In a real application, you would send the search parameters to the backend
        // For now, we'll filter the existing restaurants based on the search text
        if (!searchText.trim()) {
            setSearchResults(allRestaurants);
            return;
        }

        const filteredResults = allRestaurants.filter(restaurant => 
            restaurant.name.toLowerCase().includes(searchText.toLowerCase()) ||
            restaurant.cuisineType.toLowerCase().includes(searchText.toLowerCase())
        );
        
        setSearchResults(filteredResults);
    };

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
