import "./CustomerLogin.css";
import Navbar from "../../components/Navbar/Navbar";
import Login from "../../components/Login";

function CustomerLogin() {
	return (
		<>
			<Navbar role="signed-out" />
			<div
				className="customer-login-fields-btns"
				style={{ display: "flex", flexDirection: "column" }}
			>
				<Login role="Customer" />
			</div>
		</>
	);
}

export default CustomerLogin;
