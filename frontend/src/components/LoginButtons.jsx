import { Link } from "react-router-dom";

const LoginButtons = () => {
	const buttonStyle = {
		width: "250px",
		height: "50px",
		fontSize: "16px",
		padding: "10px",
		cursor: "pointer",
	};

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				gap: "10px",
				alignItems: "center",
			}}
		>
			<Link to="/admin-login">
				<button
					style={{
						...buttonStyle,
						backgroundColor: "red",
						color: "white",
					}}
				>
					Admin Login
				</button>
			</Link>
			<Link to="/restaurant-manager-login">
				<button
					style={{
						...buttonStyle,
						backgroundColor: "red",
						color: "white",
					}}
				>
					Restaurant Manager Login
				</button>
			</Link>
			<Link to="/customer-login">
				<button
					style={{
						...buttonStyle,
						backgroundColor: "red",
						color: "white",
					}}
				>
					Customer Login
				</button>
			</Link>
			<Link to="/customer-registration">
				<button
					style={{
						...buttonStyle,
						backgroundColor: "white",
						color: "black",
						border: "2px solid black",
					}}
				>
					New Customer
				</button>
			</Link>
		</div>
	);
};

export default LoginButtons;
