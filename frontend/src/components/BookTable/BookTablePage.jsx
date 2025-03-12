import React, { useState, useEffect } from "react";
import "./BookTablePage.css";

const BookTablePage = ({ initialDate, initialTime, initialPeople }) => {
  const [date, setDate] = useState(initialDate || "");
  const [time, setTime] = useState(initialTime || "");
  const [people, setPeople] = useState(initialPeople || "");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = () => {
    // Mock search results
    setSearchResults([
      { name: "Restaurant A", times: ["5:30", "6:00"] },
      { name: "Restaurant B", times: ["5:30", "6:00", "6:30"] },
      { name: "Restaurant C", times: ["5:30", "6:00"] },
    ]);
  };

  return (
    <div className="book-table-page">
      <header className="header">
        <h1>BookTable</h1>
        <div className="user-info">
          <span>User Name</span>
          <button>Log out</button>
        </div>
      </header>
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
        <input type="text" placeholder="Search for restaurant" />
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookTablePage;