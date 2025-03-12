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
			<Link to="/log-in">
				<button
					style={{
						...buttonStyle,
						backgroundColor: "red",
						color: "white",
					}}
				>
					Login
				</button>
			</Link>
			<Link to="/register">
				<button
					style={{
						...buttonStyle,
						backgroundColor: "white",
						color: "black",
						border: "2px solid black",
					}}
				>
					Register
				</button>
			</Link>
		</div>
	);
};

export default LoginButtons;
