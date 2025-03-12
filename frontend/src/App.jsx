import "./App.css";
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import StartLogin from "./pages/StartLogin/StartLogin";

import AdminDash from "./pages/AdminDash/AdminDash";
import AdminAnalytics from "./pages/AdminAnalytics/AdminAnalytics";

import Login from "./components/Login";
import Register from "./components/Register";
import CustomerProfile from "./pages/Customer/CustomerProfile";
import RestaurantManagerHome from "./pages/RestaurantManager/RestaurantManagerHome";
import RestaurantManagerAddRestaurant from "./pages/RestaurantManager/RestaurantManagerAddRestaurant";

function App() {
	const [alertMessages, setAlertMessages] = useState({
		isOpen: false,
		message: "",
		type: "error",
	});

	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<StartLogin />} />

				<Route path="/admin-dash" element={<AdminDash />} />
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
					element={<RestaurantManagerHome />}
				/>
				<Route
					path="/restaurant-manager-add-restaurant"
					element={<RestaurantManagerAddRestaurant />}
				/>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
