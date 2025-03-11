import "./AdminAnalytics.css";
import Navbar from "../../components/Navbar/Navbar";

// get this month
const CurrentMonth = () => {
	const todayMonth = new Date().toLocaleString("en-US", { month: "long" });
	return todayMonth;
  };

// display this month's statistics so far
function AdminAnalytics() {
	const todayMonth = CurrentMonth();
	return (
		<>
			<Navbar role="adminback" />
			<div>
				<h2>Admin Analytics</h2>
				<h3> {todayMonth}'s Reservations </h3>
			</div>
			
		</>
	);
}

export default AdminAnalytics;
