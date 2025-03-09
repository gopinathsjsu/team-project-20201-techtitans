import "./RestaurantManagerLogin.css";
import Navbar from "../../components/Navbar/Navbar";
import Login from "../../components/Login";

function RestaurantManagerLogin() {
	return (
		<>
			<Navbar role="signed-out" />
			<div
				className="restaurant-manager-login-fields-btns"
				style={{ display: "flex", flexDirection: "column" }}
			>
				<Login role="Restaurant Manager" />
			</div>
		</>
	);
}

export default RestaurantManagerLogin;
