import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AlertMessage from "./AlertMessage";
import Navbar from "./Navbar/Navbar";

function Register(props) {
	const { alertMessages, setAlertMessages } = props;
	const [error, setError] = useState({});
	const [isDisable, setDisable] = useState(false);
	const [user, setUser] = useState({
		userame: "",
		email: "",
		password: "",
		status: "Customer",
		reservations: [],
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
			errors.username = "Please enter a username.";
			bool = false;
		}
		if (user.email.length === 0) {
			errors.email = "Please enter an email address.";
			bool = false;
		}
		if (user.password.length === 0) {
			errors.password = "Please enter a password.";
			bool = false;
		}
		setError(errors);
		return bool;
	}

	async function makeUserCall(user) {
		try {
			const response = await axios.post(
				"http://127.0.0.1:5000/users",
				user
			);
			return response;
		} catch (error) {
			return error;
		}
	}

	function addUser() {
		if (validate()) {
			setDisable(true);
			makeUserCall(user).then((result) => {
				if (result && result.status === 201) {
					// update user session & token
					// eventually navigate with customer id
					if (result.data.status == "Customer") {
						navigate("/customer-profile");
					} else if (result.data.status == "RestaurantManager") {
						navigate("/restaurant-manager-home");
					}
				} else if (result.response.status === 500) {
					setAlertMessages({
						isOpen: true,
						message: "Invalid input. Unable to register.",
						type: "error",
					});
				} else if (result.response.status === 401) {
					setAlertMessages({
						isOpen: true,
						message: "Existing email or username.",
						type: "error",
					});
				} else if (result.response.status === 400) {
					setAlertMessages({
						isOpen: true,
						message: result.response.data,
						type: "error",
					});
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
					textAlign: "center",
					padding: "20px",
					marginBottom: "10px",
					display: "flex",
					flexDirection: "column",
				}}
			>
				<h3>Registration</h3>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						if (!isDisable) {
							addUser();
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
						type="text"
						placeholder="Email"
						name="email"
						style={{ ...textBoxStyle }}
						onChange={handleChange}
					/>
					{error.email && (
						<p style={{ color: "red" }}>Error: {error.email}</p>
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
					<select
						name="status"
						style={{ ...textBoxStyle }}
						onChange={handleChange}
					>
						<option value="Customer">Customer</option>
						<option value="RestaurantManager">
							Restaurant Manager
						</option>
					</select>
					<button
						style={{
							width: "100%",
							padding: "10px",
							backgroundColor: "red",
							color: "white",
						}}
						type="submit"
					>
						Register
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

export default Register;
