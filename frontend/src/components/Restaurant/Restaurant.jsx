import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Gallery from "../Gallery/Gallery";
import Reviews from "../Reviews/Reviews";
import PopularDishes from "../PopularDishes/PopularDishes";
import Menu from "../Menu/Menu";
import "./Restaurant.css";

const Restaurant = () => {
	const navigate = useNavigate();
	const [date, setDate] = useState("");
	const [time, setTime] = useState("");
	const [people, setPeople] = useState(1);
	const restaurantName = "Restaurant ABC"; // Replace with actual restaurant name

	const handleReserveClick = () => {
		navigate("/reservation-confirmation", {
			state: { restaurantName, date, time, people },
		});
	};

	return (
		<div className="restaurant-page">
			<header className="restaurant-header">
				<h1>BookTable</h1>
				<div className="user-info">
					<span>User Name</span>
					<button>Log out</button>
				</div>
			</header>
			<div className="image-container">
				<div className="restaurant-main-image">
					<img
						src="path/to/restaurant-main-photo.jpg"
						alt="Restaurant Main"
					/>
				</div>
				<div className="restaurant-sub-images">
					<div className="sub-image">
						<img
							src="path/to/restaurant-sub-photo1.jpg"
							alt="Restaurant Sub 1"
						/>
					</div>
					<div className="sub-image">
						<img
							src="path/to/restaurant-sub-photo2.jpg"
							alt="Restaurant Sub 2"
						/>
					</div>
				</div>
			</div>
			<h2 className="restaurant-name">{restaurantName}</h2>
			<nav className="restaurant-nav">
				<a href="#overview">Overview</a>
				<a href="#reviews">Reviews</a>
				<a href="#gallery">Gallery</a>
				<a href="#popular-dishes">Popular Dishes</a>
				<a href="#menu">Menu</a>
			</nav>
			<div className="content-and-reservation">
				<div className="content">
					<section id="overview" className="restaurant-section">
						<h2>Overview</h2>
						<p>Overview content goes here...</p>
					</section>
					<section id="reviews" className="restaurant-section">
						<Reviews />
					</section>
					<section id="gallery" className="restaurant-section">
						<Gallery />
					</section>
					<section id="popular-dishes" className="restaurant-section">
						<PopularDishes />
					</section>
					<section id="menu" className="restaurant-section">
						<Menu />
					</section>
				</div>

				<aside className="reservation">
					<h2>Make a reservation</h2>
					<form>
						<label>
							No. of people
							<input
								type="number"
								min="1"
								max="10"
								value={people}
								onChange={(e) => setPeople(e.target.value)}
							/>
						</label>
						<label>
							Date
							<input
								type="date"
								value={date}
								onChange={(e) => setDate(e.target.value)}
							/>
						</label>
						<label>
							Time
							<select
								name="time"
								value={time}
								onChange={(e) => setTime(e.target.value)}
							>
								<option>5:30</option>
								<option>6:00</option>
								<option>6:30</option>
								<option>6:45</option>
								<option>7:00</option>
							</select>
						</label>
						<button type="button" onClick={handleReserveClick}>
							Reserve
						</button>
					</form>
				</aside>
			</div>
		</div>
	);
};

export default Restaurant;
