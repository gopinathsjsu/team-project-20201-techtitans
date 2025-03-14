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
import BookTablePage from "./components/BookTable/BookTablePage";
import Restaurant from "./components/Restaurant/Restaurant";
import ReservationConfirmation from "./components/ReservationConfirmation/ReservationConfirmation";

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
