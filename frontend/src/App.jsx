import "./App.css";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import StartLogin from "./pages/StartLogin/StartLogin";

import AdminDash from "./pages/AdminDash/AdminDash";
import AdminAnalytics from "./pages/AdminAnalytics/AdminAnalytics";

import Login from "./components/Login";
import Register from "./components/Register";
import CustomerProfile from "./pages/Customer/CustomerProfile";
import RestaurantManagerHome from "./pages/RestaurantManager/RestaurantManagerHome";
import RestaurantManagerAddRestaurant from "./pages/RestaurantManager/RestaurantManagerAddRestaurant";
import BookTablePage from "./pages/BookTable/BookTablePage";
import Restaurant from "./pages/Restaurant/Restaurant";
import ReservationConfirmation from "./pages/ReservationConfirmation/ReservationConfirmation";

function App() {
	const [pendingRestaurants, setPendingRestaurants] = useState([]);
	const [verifiedRestaurants, setVerifiedRestaurants] = useState([]);
	const [alertMessages, setAlertMessages] = useState({
		isOpen: false,
		message: "",
		type: "error",
	});

	async function fetchPendingRestaurants() {
		try {
			const response = await axios.get(
				"http://127.0.0.1:5173/restaurants/pending"
			);
			return response.data;
		} catch (error) {
			return false;
		}
	}

	async function fetchVerifiedRestaurants() {
		try {
			const response = await axios.get(
				"http://127.0.0.1:5173/restaurants/verified"
			);
			return response.data;
		} catch (error) {
			return false;
		}
	}

	useEffect(() => {
		fetchPendingRestaurants().then((result) => {
			setPendingRestaurants(result);
		});
		fetchVerifiedRestaurants().then((result) => {
			setVerifiedRestaurants(result);
		});
	}, []);

	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<StartLogin />} />
				<Route
					path="/admin-dash"
					element={
						<AdminDash
							pendingRestaurants={pendingRestaurants}
							setPendingRestaurants={setPendingRestaurants}
							fetchPendingRestaurants={fetchPendingRestaurants}
							alertMessages={alertMessages}
							setAlertMessages={setAlertMessages}
						/>
					}
				/>
				<Route path="/admin-analytics" element={<AdminAnalytics />} />
				<Route
					path="/log-in"
					element={
						<Login
							alertMessages={alertMessages}
							setAlertMessages={setAlertMessages}
						/>
					}
				/>
				<Route
					path="/register"
					element={
						<Register
							alertMessages={alertMessages}
							setAlertMessages={setAlertMessages}
						/>
					}
				/>
				<Route path="/customer-profile" element={<CustomerProfile />} />
				<Route
					path="/restaurant-manager-home"
					element={
						<RestaurantManagerHome
							pendingRestaurants={pendingRestaurants}
							verifiedRestaurants={verifiedRestaurants}
							setAlertMessages={setAlertMessages}
						/>
					}
				/>
				<Route
					path="/restaurant-manager-add-restaurant"
					element={<RestaurantManagerAddRestaurant />}
				/>
				<Route path="/book-table" element={<BookTablePage />} />
				<Route
					path="/restaurant/:restaurantId"
					element={<Restaurant />}
				/>
				<Route
					path="/reservation-confirmation"
					element={<ReservationConfirmation />}
				/>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
