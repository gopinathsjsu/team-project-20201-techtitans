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
		</div>
	);
};

export default Login;
