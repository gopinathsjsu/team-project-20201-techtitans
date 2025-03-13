import { Snackbar, Alert } from "@mui/material";

export default function AlertMessage(props) {
	const { alertMessages, setAlertMessages } = props;

	const handleClose = () => {
		setAlertMessages({
			...alertMessages,
			isOpen: false,
		});
	};

	return (
		<Snackbar
			open={alertMessages.isOpen}
			anchorOrigin={{ vertical: "top", horizontal: "center" }}
			onClose={handleClose}
		>
			<Alert
				variant="filled"
				severity={alertMessages.type}
				onClose={handleClose}
			>
				{alertMessages.message}
			</Alert>
		</Snackbar>
	);
}
