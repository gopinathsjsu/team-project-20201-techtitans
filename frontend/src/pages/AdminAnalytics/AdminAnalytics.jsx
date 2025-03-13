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
			<div>
				<h2>Admin Analytics</h2>
				<h3>Showing stats from: {getDate30DaysAgo()} to {getTodayDate()}</h3>
			</div>
		</>
	);
}

export default AdminAnalytics;