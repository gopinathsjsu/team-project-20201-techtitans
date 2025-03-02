const Login = () => {
	const textBoxStyle = {
		marginBottom: "10px",
		padding: "8px",
	}

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
			<h3>Customer Registration</h3>
			<input
				type="text"
				placeholder="Username"
				style={{ ...textBoxStyle }}
			/>
			<input
				type="text"
				placeholder="Email"
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
				Register
			</button>
		</div>
	)
}

export default Login
