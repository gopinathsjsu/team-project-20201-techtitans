import "./AdminAnalytics.css";
import Navbar from "../../components/Navbar/Navbar";

function AdminAnalytics() {
	const getDate30DaysAgo = () => {
		const date = new Date();
		date.setDate(date.getDate() - 30);
		// formats MM/DD/YYYY
		return date.toLocaleDateString();
	};

	const getTodayDate = () => {
		const date = new Date();
		// formats MM/DD/YYYY
		return date.toLocaleDateString();
	};

	return (
		<>
			<Navbar role="adminback" />
			<div className="admin-analytics-container">
				<h2>Admin Analytics</h2>
				<h3>
					{/* Uncomment this line for the demo */}
					{/* Showing stats from: {getDate30DaysAgo()} to {getTodayDate()} */}
					Showing stats from: 3/1/2025 to 3/30/2025
				</h3>
				<div className="iframe-container">
					<iframe
						width="740"
						height="580"
						src="https://charts.mongodb.com/charts-project-0-hxqbckt/embed/charts?id=6ff58bd4-2404-4a4a-ab3a-07cc1f93c18e&maxDataAge=3600&theme=light&autoRefresh=true"
						title="Bar Chart Reservations"
					></iframe>

					<iframe
						width="640"
						height="580"
						src="https://charts.mongodb.com/charts-project-0-hxqbckt/embed/charts?id=0a94d169-00f4-4cf3-9e1c-005857777cb9&maxDataAge=3600&theme=light&autoRefresh=true"
						title="Number of Reservations"
					/>
				</div>
			</div>
		</>
	);
}

export default AdminAnalytics;
