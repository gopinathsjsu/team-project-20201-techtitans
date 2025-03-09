import "./StartLogin.css";
import Navbar from "../../components/Navbar/Navbar";
import LoginButtons from "../../components/LoginButtons";

function StartLogin() {
	return (
		<>
			<Navbar role="signed-out" />
			<div
				className="login-btns"
				style={{ display: "flex", flexDirection: "column" }}
			>
				<LoginButtons />
			</div>
		</>
	);
}

export default StartLogin;
