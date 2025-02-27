//Some help from tutorial: https://www.youtube.com/watch?v=amf18mxNX18
import './Navbar.css';
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <header className="nav-header">
            <Link to='/' className="nav-logo">BookTable</Link>
            <nav className="admin-login">
                <Link to='/' className="admin-btns">
                    <button>View Analytics</button>
                </Link>
                <Link to='/' className="admin-btns">
                    <button>Log out</button>
                </Link>
            </nav>
        </header>
    )
}

export default Navbar