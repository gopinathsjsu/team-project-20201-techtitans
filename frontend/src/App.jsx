import "./App.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useCookies } from "react-cookie";
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

function PrivateRoute(props) {
	const [cookies] = useCookies(["auth_token"]);
	const { role, userStatus, children } = props;
	if (cookies.auth_token === undefined) {
		return <Navigate to="/log-in" />;
	}

	if (role != userStatus) {
		if (userStatus == "Customer") {
			return <Navigate to="/customer-profile" />;
		} else if (userStatus == "RestaurantManager") {
			return <Navigate to="/restaurant-manager-home" />;
		} else if (userStatus == "Admin") {
			return <Navigate to="/admin-dash" />;
		}
	}
	return children;
}

function App() {
	const [user, setUser] = useState({});
	const [pendingRestaurants, setPendingRestaurants] = useState([]);
	const [verifiedRestaurants, setVerifiedRestaurants] = useState([]);
	const [cookies, setCookie] = useCookies(["auth_token"]);
	const [alertMessages, setAlertMessages] = useState({
		isOpen: false,
		message: "",
		type: "error",
	});

	function setToken(token) {
		// change the token duration for your testing (make sure it's the same as the backend in seconds)
		setCookie("auth_token", token, {
			maxAge: 10,
			path: "/",
		});
	}

	function updateUser(data) {
		setToken(data.token);
		setUser(data.savedUser);
	}

	async function fetchUser() {
		try {
			const config = {
				headers: { Authorization: `Bearer ${cookies.auth_token}` },
			};
			const response = await axios.get(
				"http://127.0.0.1:5173/user",
				config
			);
			return response;
		} catch (error) {
			return false;
		}
	}

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
		if (Object.keys(user).length === 0) {
			/* user got overridden so we have to reset it again
		  call the token to get the user data from backend
		  that way we can reset the user and user info stays
		  whenever page reloads/re-renders */
			if (cookies.auth_token !== undefined) {
				fetchUser().then((result) => {
					if (result) {
						setUser(result.data);
					}
				});
			}
		}
	}, [user]);

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
							handleLoginIn={updateUser}
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
				<Route
					path="/customer-profile"
					element={
						<PrivateRoute role="Customer" userStatus={user.status}>
							<CustomerProfile />
						</PrivateRoute>
					}
				/>
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
