import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import LoginButtons from "./components/LoginButtons";
import Login from "./components/Login";
import CustomerRegister from "./components/CustomerRegister";

// demonstration of the first login page (buttons)
function App() {
	return (
		<div style={{ display: "flex", flexDirection: "column" }}>
			<LoginButtons />
			<div style={{ display: "flex", flexDirection: "column" }}>
				<Login role="Admin" />
				<Login role="Restaurant Manager" />
				<Login role="Customer" />
				<CustomerRegister />
			</div>
		</div>
	);
}

export default App;
