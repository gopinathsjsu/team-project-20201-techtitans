import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Reviews from "../../components/Reviews/Reviews";
import PopularDishes from "../../components/PopularDishes/PopularDishes";
import Menu from "../../components/Menu/Menu";
import Navbar from "../../components/Navbar/Navbar";
import ReservationForm from "../../components/Reservation/ReservationForm";
import MapComponent from "../../components/MapComponent/MapComponent";
import "./Restaurant.css";

const Restaurant = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const [restaurant, setRestaurant] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [menus, setMenus] = useState([]);

	async function fetchMenus() {
		try {
			const response = await axios.get(
				`http://127.0.0.1:5000/menu/${id}`
			);
			return response;
		} catch (error) {
			return false;
		}
	}

	useEffect(() => {
		fetchMenus().then((result) => {
			setMenus(result.data);
		});
	}, [menus]);

	useEffect(() => {
		const fetchRestaurant = async () => {
			try {
				setRestaurant(null);
				setLoading(true);
				const response = await axios.get(
					`http://localhost:5000/restaurants/${id}`
				);
				if (response.data) {
					setRestaurant(response.data);
				} else {
					setError("No restaurant data received");
				}
			} catch (error) {
				console.error("Error fetching restaurant:", error);
				if (error.response?.status === 404) {
					navigate("/book-table");
				} else {
					setError("Failed to load restaurant data");
				}
			} finally {
				setLoading(false);
			}
		};

		if (id) {
			fetchRestaurant();
		}
	}, [id, navigate]);

	if (loading) {
		return (
			<div className="restaurant-page">
				<Navbar role="customer" />
				<div className="loading">Loading restaurant details...</div>
			</div>
		);
	}

	if (error || !restaurant) {
		return (
			<div className="restaurant-page">
				<Navbar role="customer" />
				<div className="error">
					{error || "Failed to load restaurant data"}
				</div>
			</div>
		);
	}

	return (
		<div className="restaurant-page">
			<Navbar role="customer" />
			<div className="main-image">
				<img src={restaurant.photos[0]} />
			</div>
			<h1 className="restaurant-title">{restaurant.name}</h1>
			<div className="content-container">
				<div className="main-content">
					<nav className="restaurant-nav">
						<a href="#overview">Overview</a>
						<a href="#reviews">Reviews</a>
						<a href="#popular-dishes">Popular Dishes</a>
						<a href="#menu">Menu</a>
						<a href="#location">Location</a>
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
						<section
							id="popular-dishes"
							className="restaurant-section"
						>
							<PopularDishes menus={menus} />
						</section>
						<section id="menu" className="restaurant-section">
							<Menu menus={menus} />
						</section>
					</div>
				</div>
				<ReservationForm restaurant={restaurant} />
			</div>

			<div className="location-section" id="location">
				<h2>Location</h2>
				<div className="map-container">
					{(() => {
						try {
							// Check if location exists and is valid
							if (
								restaurant.location &&
								Array.isArray(restaurant.location) &&
								restaurant.location.length === 2 &&
								isFinite(restaurant.location[1]) &&
								isFinite(restaurant.location[0]) &&
								Math.abs(restaurant.location[1]) <= 90 &&
								Math.abs(restaurant.location[0]) <= 180
							) {
								return (
									<MapComponent
										latitude={restaurant.location[1]}
										longitude={restaurant.location[0]}
									/>
								);
							} else {
								// Default to San Jose
								return (
									<MapComponent
										latitude={37.3382}
										longitude={-121.8863}
									/>
								);
							}
						} catch (error) {
							console.error("Error rendering map:", error);
							// Default to San Jose on error
							return (
								<MapComponent
									latitude={37.3382}
									longitude={-121.8863}
								/>
							);
						}
					})()}
				</div>
			</div>
		</div>
	);
};

export default Restaurant;
