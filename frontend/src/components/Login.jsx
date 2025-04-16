import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AlertMessage from "./AlertMessage";
import Navbar from "./Navbar/Navbar";

function Login(props) {
	const { handleLoginIn, alertMessages, setAlertMessages } = props;
	const [error, setError] = useState({});
	const [isDisable, setDisable] = useState(false);
	const [user, setUser] = useState({
		userame: "",
		password: "",
	});
	const textBoxStyle = {
		marginBottom: "10px",
		padding: "8px",
	};
	const navigate = useNavigate();

	function handleChange(event) {
		const { value } = event.target;
		setUser({
			...user,
			[event.target.name]: value,
		});
	}

	function validate() {
		let bool = true;
		const errors = {};
		if (user.username.length === 0) {
			errors.username = "Please enter your username.";
			bool = false;
		}
		if (user.password.length === 0) {
			errors.password = "Please enter your password.";
			bool = false;
		}
		setError(errors);
		return bool;
	}

	async function makeLoginCall(user) {
		try {
			const response = await axios.post(
				"http://127.0.0.1:5000/log-in",
				user
			);
			return response;
		} catch (error) {
			return error;
		}
	}

	function loginUser() {
		if (validate()) {
			setDisable(true);
			makeLoginCall(user).then((result) => {
				if (result && result.status === 201) {
					handleLoginIn(result.data);
					if (result.data.savedUser.status == "Customer") {
						// eventually navigate with customer id
						navigate("/customer-profile");
					} else if (
						result.data.savedUser.status == "RestaurantManager"
					) {
						navigate("/restaurant-manager-home");
					} else if (result.data.savedUser.status == "Admin") {
						navigate("/admin-dash");
					}
				} else {
					if (result.response.data) {
						setAlertMessages({
							isOpen: true,
							message: result.response.data,
							type: "error",
						});
					}
				}
			});
		}
	}

	return (
		<div
			style={{
				display: "flex",
				textAlign: "center",
				alignItems: "center",
				justifyContent: "center",
				width: "100vw",
			}}
		>
			<Navbar role="signed-out" />
			<div
				style={{
					maxWidth: "250px",
					fontSize: "16px",
					margin: "20px auto",
					padding: "20px",
					marginBottom: "10px",
					display: "flex",
					flexDirection: "column",
				}}
			>
				<h3>Login</h3>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						if (!isDisable) {
							loginUser();
						}
					}}
				>
					<input
						type="text"
						placeholder="Username"
						name="username"
						style={{ ...textBoxStyle }}
						onChange={handleChange}
					/>
					{error.username && (
						<p style={{ color: "red" }}>Error: {error.username}</p>
					)}
					<input
						type="password"
						placeholder="Password"
						name="password"
						style={{ ...textBoxStyle }}
						onChange={handleChange}
					/>
					{error.password && (
						<p style={{ color: "red" }}>Error: {error.password}</p>
					)}
					<button
						style={{
							width: "100%",
							padding: "10px",
							backgroundColor: "red",
							color: "white",
						}}
						type="submit"
					>
						Login
					</button>
					<AlertMessage
						alertMessages={alertMessages}
						setAlertMessages={setAlertMessages}
					/>
				</form>
			</div>
		</div>
	);
}

export default Login;
