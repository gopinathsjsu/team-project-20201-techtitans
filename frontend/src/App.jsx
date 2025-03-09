import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import LoginButtons from "./components/LoginButtons";
import Login from "./components/Login";
import CustomerRegister from "./components/CustomerRegister";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import StartLogin from "./pages/StartLogin/StartLogin";
import AdminLogin from "./pages/AdminLogin/AdminLogin";
import RestaurantManagerLogin from "./pages/RestaurantManagerLogin/RestaurantManagerLogin";
import CustomerLogin from "./pages/CustomerLogin/CustomerLogin";
import CustomerRegistration from "./pages/CustomerRegistration/CustomerRegistration";
import CustomerProfile from "./pages/CustomerProfile/CustomerProfile";

import RestaurantManagerHome from "./pages/RestaurantManagerHome/RestaurantManagerHome";
import RestaurantManagerAddRestaurant from "./pages/RestaurantManagerAddRestaurant/RestaurantManagerAddRestaurant";

// demonstration of the first login page (buttons)
function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<StartLogin />} />
				<Route path="/admin-login" element={<AdminLogin />} />
				<Route
					path="/restaurant-manager-login"
					element={<RestaurantManagerLogin />}
				/>
				<Route path="/customer-login" element={<CustomerLogin />} />
				<Route
					path="/customer-registration"
					element={<CustomerRegistration />}
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
			{/*
			<div style={{ display: "flex", flexDirection: "column" }}>
				<LoginButtons />
				<div style={{ display: "flex", flexDirection: "column" }}>
					<Login role="Admin" />
					<Login role="Restaurant Manager" />
					<Login role="Customer" />
					<CustomerRegister />
				</div>
			</div>
			*/}
		</BrowserRouter>
	);
}

export default App;
