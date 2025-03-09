import { Link } from "react-router-dom";

const Login = ({ role }) => {
	const textBoxStyle = {
		marginBottom: "10px",
		padding: "8px",
	};

	return (
		<div
			style={{
				maxWidth: "250px",
				fontSize: "16px",
				margin: "20px auto",
				textAlign: "center",
				padding: "20px",
				marginBottom: "10px",
			}}
		>
			<h3>{role} Login</h3>
			<input
				type="text"
				placeholder="Username"
				style={{ ...textBoxStyle }}
			/>
			<input
				type="password"
				placeholder="Password"
				style={{ ...textBoxStyle }}
			/>
			{role == "Admin" && (
				<>
					<Link to="/admin-home">
						<button
							style={{
								width: "100%",
								padding: "10px",
								backgroundColor: "red",
								color: "white",
							}}
						>
							Login
						</button>
					</Link>
				</>
			)}
			{role == "Restaurant Manager" && (
				<>
					<Link to="/restaurant-manager-home">
						<button
							style={{
								width: "100%",
								padding: "10px",
								backgroundColor: "red",
								color: "white",
							}}
						>
							Login
						</button>
					</Link>
				</>
			)}
			{role == "Customer" && (
				<>
					<Link to="/customer-home">
						<button
							style={{
								width: "100%",
								padding: "10px",
								backgroundColor: "red",
								color: "white",
							}}
						>
							Login
						</button>
					</Link>
				</>
			)}
		</div>
	);
};

export default Login;
