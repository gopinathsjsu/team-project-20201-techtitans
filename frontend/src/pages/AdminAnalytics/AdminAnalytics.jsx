import "./AdminAnalytics.css";
import Navbar from "../../components/Navbar/Navbar";

function AdminAnalytics() {
	// Function to get the date from 30 days ago
	const getDate30DaysAgo = () => {
		const date = new Date();
		date.setDate(date.getDate() - 30);
		// formats MM/DD/YYYY
		return date.toLocaleDateString(); 
	};

	// Function to get today's date
	const getTodayDate = () => {
		const date = new Date();
		// formats MM/DD/YYYY
		return date.toLocaleDateString(); 
	};

	return (
		<>
			<Navbar role="adminback" />
			<div>
				<h2>Admin Analytics</h2>
				<h3>Showing stats from: {getDate30DaysAgo()} to {getTodayDate()}</h3>
			</div>
		</>
	);
}

export default AdminAnalytics;