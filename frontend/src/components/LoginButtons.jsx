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
			<button
				style={{
					...buttonStyle,
					backgroundColor: "red",
					color: "white",
				}}
			>
				Admin Login
			</button>
			<button
				style={{
					...buttonStyle,
					backgroundColor: "red",
					color: "white",
				}}
			>
				Restaurant Manager Login
			</button>
			<button
				style={{
					...buttonStyle,
					backgroundColor: "red",
					color: "white",
				}}
			>
				Customer Login
			</button>
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
		</div>
	);
};

export default LoginButtons;
