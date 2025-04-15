import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Gallery from "../../components/Gallery/Gallery";
import Reviews from "../../components/Reviews/Reviews";
import PopularDishes from "../../components/PopularDishes/PopularDishes";
import Menu from "../../components/Menu/Menu";
import Navbar from "../../components/Navbar/Navbar";
import "./Restaurant.css";

const Restaurant = () => {
	const navigate = useNavigate();
	const { id } = useParams();

	const [restaurant, setRestaurant] = useState(null);
	const [activeTab, setActiveTab] = useState("overview");
	const [date, setDate] = useState("");
	const [time, setTime] = useState("");
	const [people, setPeople] = useState("");

	// Fetch restaurant data
	useEffect(() => {
		const fetchRestaurant = async () => {
			try {
				setRestaurant(null); // Reset restaurant while loading
				const response = await axios.get(
					`http://localhost:5000/restaurants/${id}`
				);
				if (response.data) {
					console.log("Restaurant data:", response.data);
					setRestaurant(response.data);
				} else {
					console.error("No restaurant data received");
				}
			} catch (error) {
				console.error("Error fetching restaurant:", error);
				// Add user-friendly error handling
				if (error.response?.status === 404) {
					alert("Restaurant not found");
					navigate("/book-table"); // Redirect to booking page
				} else {
					alert("Error loading restaurant details");
				}
			}
		};

		if (id) {
			fetchRestaurant();
		}
	}, [id, navigate]);

	const handleReserveClick = () => {
		navigate("/reservation-confirmation", {
			state: {
				restaurantName: restaurant?.name || "Restaurant",
				date,
				time,
				people,
			},
		});
	};

	const handleTabClick = (tab) => {
		setActiveTab(tab);
	};

	// Show loading state
	if (!restaurant) {
		return (
			<div className="restaurant-page">
				<Navbar role="customer" />
				<div className="loading">Loading restaurant details...</div>
			</div>
		);
	}

	return (
		<div className="restaurant-page">
			<Navbar role="customer" />
			<div className="main-image">
				<img
					src={
						restaurant.imageUrl ||
						"https://resizer.otstatic.com/v2/photos/wide-huge/3/48791525.jpg"
					}
				/>
			</div>
			<h1 className="restaurant-title">{restaurant.name}</h1>

			<div className="content-container">
				<div className="main-content">
					<nav className="restaurant-nav">
						<a href="#overview">Overview</a>
						<a href="#reviews">Reviews</a>
						<a href="#gallery">Gallery</a>
						<a href="#popular-dishes">Popular Dishes</a>
						<a href="#menu">Menu</a>
					</nav>
					<div className="content">
						<section id="overview" className="restaurant-section">
							<h2>Overview</h2>
							<p>
								{restaurant.description ||
									"Overview content goes here..."}
							</p>
						</section>
						<section id="reviews" className="restaurant-section">
							<Reviews />
						</section>
						<section id="gallery" className="restaurant-section">
							<Gallery />
						</section>
						<section
							id="popular-dishes"
							className="restaurant-section"
						>
							<PopularDishes />
						</section>
						<section id="menu" className="restaurant-section">
							<Menu />
						</section>
					</div>
				</div>

				<div className="reservation-form">
					<h3>Make a reservation</h3>
					<div className="form-row">
						<div className="form-group">
							<label>No. of people</label>
							<input
								type="number"
								min="1"
								max="10"
								value={people}
								onChange={(e) => setPeople(e.target.value)}
							/>
						</div>
						<div className="form-group">
							<label>Date</label>
							<input
								type="date"
								value={date}
								onChange={(e) => setDate(e.target.value)}
							/>
						</div>
						<div className="form-group time-container">
							<label>Time</label>
							<select
								value={time}
								onChange={(e) => setTime(e.target.value)}
							>
								<option value="5:30">5:30 PM</option>
								<option value="6:00">6:00 PM</option>
								<option value="6:30">6:30 PM</option>
								<option value="6:45">6:45 PM</option>
								<option value="7:00">7:00 PM</option>
							</select>
						</div>
						<div className="form-group button-container">
							<button
								className="reserve-button"
								type="button"
								onClick={handleReserveClick}
							>
								Reserve
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Restaurant;
