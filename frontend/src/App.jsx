import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import StartLogin from "./pages/StartLogin/StartLogin";
import AdminLogin from "./pages/AdminLogin/AdminLogin";
import RestaurantManagerLogin from "./pages/RestaurantManagerLogin/RestaurantManagerLogin";
import CustomerLogin from "./pages/CustomerLogin/CustomerLogin";

import CustomerRegistration from "./pages/CustomerRegistration/CustomerRegistration";
import CustomerProfile from "./pages/CustomerProfile/CustomerProfile";

import RestaurantManagerHome from "./pages/RestaurantManagerHome/RestaurantManagerHome";
import RestaurantManagerAddRestaurant from "./pages/RestaurantManagerAddRestaurant/RestaurantManagerAddRestaurant";

import AdminDash from "./pages/AdminDash/AdminDash";
import AdminAnalytics from "./pages/AdminAnalytics/AdminAnalytics";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<StartLogin />} />
				

				{/* Admin Routing */}
				<Route path="/admin-login" element={<AdminLogin />} />
				<Route path="/admin-dash" element={<AdminDash />} />
				<Route path="/admin-analytics" element={<AdminAnalytics />} />

				{/* Customer Routing */}
				<Route path="/customer-login" element={<CustomerLogin />} />
				<Route
					path="/customer-registration"
					element={<CustomerRegistration />}
				/>
				<Route path="/customer-profile" element={<CustomerProfile />} />

				{/* Restuarant Manager Routing */}
				<Route
					path="/restaurant-manager-login"
					element={<RestaurantManagerLogin />}
				/>
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
