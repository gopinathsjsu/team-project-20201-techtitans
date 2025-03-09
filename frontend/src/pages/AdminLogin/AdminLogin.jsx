import "./AdminLogin.css";
import Navbar from "../../components/Navbar/Navbar";
import Login from "../../components/Login";

function AdminLogin() {
	return (
		<>
			<Navbar role="signed-out" />
			<div
				className="admin-login-fields-btns"
				style={{ display: "flex", flexDirection: "column" }}
			>
				<Login role="Admin" />
			</div>
		</>
	);
}

export default AdminLogin;
