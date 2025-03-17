import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import "./BookTablePage.css";

const BookTablePage = () => {
	const [date, setDate] = useState("");
	const [time, setTime] = useState("");
	const [people, setPeople] = useState(1);
	const [searchText, setSearchText] = useState("");
	const [searchResults, setSearchResults] = useState([]);

	const handleSearch = () => {
		// Mock search results
		setSearchResults([
			{
				id: "60d5ec49f1e4e2a5d8b5b5b6",
				name: "Restaurant A",
				times: ["5:30", "6:00"],
			},
			{
				id: "60d5ec49f1e4e2a5d8b5b5b7",
				name: "Restaurant B",
				times: ["5:30", "6:00", "6:30"],
			},
			{
				id: "60d5ec49f1e4e2a5d8b5b5b8",
				name: "Restaurant C",
				times: ["5:30", "6:00"],
			},
		]);
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
				{searchResults.map((result, index) => (
					<div key={index} className="restaurant-result">
						<span>{result.name}</span>
						<div className="available-times">
							{result.times.map((time, idx) => (
								<button key={idx}>{time}</button>
							))}
						</div>
						<Link to={`/restaurant/${result.id}`}>
							<button>View Restaurant</button>
						</Link>
					</div>
				))}
			</div>
		</div>
	);
};

export default BookTablePage;
