//Some help from tutorial: https://www.youtube.com/watch?v=amf18mxNX18
import "./Navbar.css";
import { Link } from "react-router-dom";

function Navbar(props) {
	return (
		<header className="nav-header">
			{props.role == "admin" && (
				<Link to="/admin-home" className="nav-logo">
					BookTable
				</Link>
			)}
			{props.role == "adminback" && (
				<Link to="/admin-home" className="nav-logo">
					BookTable
				</Link>
			)}
			{props.role == "restaurant-manager" && (
				<Link to="/restaurant-manager-home" className="nav-logo">
					BookTable
				</Link>
			)}
			{props.role == "customer" && (
				<Link to="/customer-home" className="nav-logo">
					BookTable
				</Link>
			)}
			{props.role == "signed-out" && (
				<div className="nav-logo">BookTable</div>
			)}
			<nav className="nav-btns-container">
				{props.role == "customer" && (
					<>
						<Link to="/customer-profile">
							<div className="user-pic"></div>
						</Link>
						<Link to="/customer-profile">
							<div className="user-name">User Name</div>
						</Link>
					</>
				)}
				{props.role == "admin" && (
					<Link to="/admin-analytics">
						<button className="nav-btns">Analytics</button>
					</Link>
				)}
				{props.role == "adminback" && (
					<Link to="/admin-dash">
						<button className="nav-btns">Dashboard</button>
					</Link>
				)}
				{props.role == "restaurant-manager" && (
					<Link to="/restaurant-manager-add-restaurant">
						<button className="nav-btns">Add Restaurant</button>
					</Link>
				)}
				{props.role != "signed-out" && (
					<Link to="/">
						<button className="nav-btns">Log out</button>
					</Link>
				)}
			</nav>
		</header>
	);
}

export default Navbar;
