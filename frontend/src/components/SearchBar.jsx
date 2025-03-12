import { useState } from "react";

const SearchBar = () => {
	// store all data inputs
	const [date, setDate] = useState("");
	const [time, setTime] = useState("");
	const [people, setPeople] = useState(1); // minmum default # of people is 1
	const [text, setText] = useState("");

	// Handle changes for each input
	const handleDateChange = (e) => setDate(e.target.value);
	const handleTimeChange = (e) => setTime(e.target.value);
	const handlePeopleChange = (e) => setPeople(e.target.value);
	const handleTextChange = (e) => setText(e.target.value);

	// Handle search button click, just in case?
	const handleSearch = () => {
		console.log("Searching for: ", { date, time, people, text });
	};

	return (
		<div
			style={{
				fontSize: "16px",
				padding: "40px",
			}}
		>
			<div>
				<label> Date: </label>
				<input type="date" value={date} onChange={handleDateChange} />

				<label> Time: </label>
				<input type="time" value={time} onChange={handleTimeChange} />

				<label> Seats: </label>
				<select value={people} onChange={handlePeopleChange}>
					<option value={1}>1</option>
					<option value={2}>2</option>
					<option value={3}>3</option>
					<option value={4}>4</option>
					<option value={5}>5</option>
				</select>

				<input
					style={{
						width: "250px",
					}}
					type="text"
					value={text}
					onChange={handleTextChange}
					placeholder="Location, cuisine.."
				/>

				<button
					style={{
						padding: "5px",
						backgroundColor: "red",
						color: "white",
					}}
					onClick={handleSearch}
				>
					Search
				</button>
			</div>
		</div>
	);
};

export default SearchBar;
