//Some help from tutorial: https://www.youtube.com/watch?v=amf18mxNX18
import "./Navbar.css"
import { Link } from "react-router-dom"

/*
The Navbar should have different buttons depending if the admin,
restaurant manager, or customer is signed in. As of now, the basic layout
is done.
*/

function Navbar() {
	return (
		<header className="nav-header">
			<Link to="/" className="nav-logo">
				BookTable
			</Link>
			<nav className="nav-btns-container">
				{/*Admin would see these buttons:*/}
				<Link to="/">
					<button className="nav-btns">Analytics</button>
				</Link>
				<Link to="/">
					<button className="nav-btns">Log out</button>
				</Link>

				{/*
                Admin would see these buttons when in the Analytics page:
                <Link to='/'>
                    <button className="nav-btns">Back</button>
                </Link>
                <Link to='/'>
                    <button className="nav-btns">Log out</button>
                </Link>

                Restaurant Manager would see these buttons:
                <Link to='/'>
                    <button className="nav-btns">Add Restaurant</button>
                </Link>
                <Link to='/'>
                    <button className="nav-btns">Log out</button>
                </Link>

                Restaurant Manager would see these buttons when adding/updating
                restaurant:
                <Link to='/'>
                    <button className="nav-btns">Back</button>
                </Link>
                <Link to='/'>
                    <button className="nav-btns">Log out</button>
                </Link>

                Customer would see these buttons:
                <Link to='/'>
                    <div className="user-pic"></div>
                </Link>
                <Link to='/'>
                    <div className="user-name">User Name</div>
                </Link>
                <Link to='/'>
                    <button className="nav-btns">Log out</button>
                </Link>
                */}
			</nav>
		</header>
	)
}

export default Navbar
