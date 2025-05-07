import "./Navbar.css";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";

function Navbar(props) {
	const { role } = props;
	const [, , removeCookie] = useCookies(["auth_token"]);
	const handleLogOut = () => {
		removeCookie("auth_token", { path: "/" });
	};

	return (
		<header className="nav-header">
			{role == "admin" && (
				<Link to="/admin-dash" className="nav-logo">
					BookTable
				</Link>
			)}
			{role == "adminback" && (
				<Link to="/admin-dash" className="nav-logo">
					BookTable
				</Link>
			)}
			{role == "restaurant-manager" && (
				<Link to="/restaurant-manager-home" className="nav-logo">
					BookTable
				</Link>
			)}
			{role == "customer" && (
				<Link to="/customer-profile" className="nav-logo">
					BookTable
				</Link>
			)}
			{role == "signed-out" && (
				<Link to="/" className="nav-logo">
					BookTable
				</Link>
			)}
			<nav className="nav-btns-container">
				{role == "customer" && (
					<>
						<Link to="/customer-profile">
							<div className="user-pic"></div>
						</Link>
						<Link to="/customer-profile">
							<div className="user-name">User Name</div>
						</Link>
					</>
				)}
				{role == "admin" && (
					<Link to="/admin-analytics">
						<button className="nav-btns">Analytics</button>
					</Link>
				)}
				{role == "adminback" && (
					<Link to="/admin-dash">
						<button className="nav-btns">Dashboard</button>
					</Link>
				)}
				{role == "restaurant-manager" && (
					<Link to="/restaurant-manager-add-restaurant">
						<button className="nav-btns">Add Restaurant</button>
					</Link>
				)}
				{role != "signed-out" && (
					<Link to="/book-table">
						<button className="nav-btns">Book Table</button>
					</Link>
				)}
				{role != "signed-out" && (
					<Link to="/">
						<button
							className="nav-btns"
							onClick={() => handleLogOut()}
						>
							Log out
						</button>
					</Link>
				)}
			</nav>
		</header>
	);
}

export default Navbar;
