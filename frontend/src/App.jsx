import "./App.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import StartLogin from "./pages/StartLogin/StartLogin";

import AdminDash from "./pages/AdminDash/AdminDash";
import AdminAnalytics from "./pages/AdminAnalytics/AdminAnalytics";

import Login from "./components/Login";
import Register from "./components/Register";
import CustomerProfile from "./pages/Customer/CustomerProfile";
import RestaurantManagerHome from "./pages/RestaurantManagerHome/RestaurantManagerHome";
import RestaurantManagerAddRestaurant from "./pages/RestaurantManagerAddRestaurant/RestaurantManagerAddRestaurant";
import RestaurantManagerAddMenu from "./pages/RestaurantManagerAddRestaurant/RestaurantManagerAddMenu";
import BookTablePage from "./pages/BookTable/BookTablePage";
import Restaurant from "./pages/Restaurant/Restaurant";
import ReservationConfirmation from "./pages/ReservationConfirmation/ReservationConfirmation";
import RestaurantManagerUpdateRestaurant from "./pages/RestaurantManagerUpdateRestaurant/RestaurantManagerUpdateRestaurant";
import RestaurantManagerRestaurantBookings from "./pages/RestaurantManagerRestaurantBookings/RestaurantManagerRestaurantBookings";

function PrivateRoute(props) {
  const [cookies, removeCookie] = useCookies(["auth_token"]);
  const navigate = useNavigate();
  const location = useLocation(); // Add this import
  const { role, userStatus, children } = props;
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check if token exists
    if (!cookies.auth_token) {
      navigate("/log-in", { state: { from: location.pathname, message: "Please log in to continue" } });
      return;
    }

    // Verify token is valid and not expired
    try {
      const decoded = jwtDecode(cookies.auth_token);
      const currentTime = Date.now() / 1000;
      
      if (decoded.exp < currentTime) {
        removeCookie("auth_token", { path: "/" });
        navigate("/log-in", { state: { message: "Your session has expired. Please log in again." } });
        return;
      }

      // Role check
      if (role !== userStatus) {
        if (userStatus === "Customer") {
          navigate("/customer-profile", { state: { message: "You don't have access to that area" } });
        } else if (userStatus === "RestaurantManager") {
          navigate("/restaurant-manager-home", { state: { message: "You don't have access to that area" } });
        } else if (userStatus === "Admin") {
          navigate("/admin-dash", { state: { message: "You don't have access to that area" } });
        }
        return;
      }
      
      // If we get here, user is authorized
      setIsAuthorized(true);
      setIsLoading(false);
    } catch (error) {
      // Invalid token
      removeCookie("auth_token", { path: "/" });
      navigate("/log-in", { state: { message: "Authentication error. Please log in again." } });
    }
  }, [cookies.auth_token, role, userStatus, navigate, location.pathname, removeCookie]);

  // Show loading state while checking authorization
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  // Only render children if user is authorized
  return isAuthorized ? children : null;
}

function App() {
	const [user, setUser] = useState({});
	const [pendingRestaurants, setPendingRestaurants] = useState([]);
	const [verifiedRestaurants, setVerifiedRestaurants] = useState([]);
	const [cookies, setCookie] = useCookies(["auth_token"]);
	const [alertMessages, setAlertMessages] = useState({
		isOpen: false,
		message: "",
		type: "error",
	});
	const [userEmail, setUserEmail] = useState("");
	const [pendingRestaurantsByEmail, setPendingRestaurantsByEmail] =
		useState([]);
	const [verifiedRestaurantsByEmail, setVerifiedRestaurantsByEmail] =
		useState([]);

	function setToken(token) {
		// change the token duration for your testing (make sure it's the same as the backend in seconds)
		setCookie("auth_token", token, {
			maxAge: 7200,
			path: "/",
		});
	}

	function updateUser(data) {
		setToken(data.token);
		setUser(data.savedUser);
	}

	async function fetchUser() {
		try {
			const config = {
				headers: { Authorization: `Bearer ${cookies.auth_token}` },
			};
			const response = await axios.get(
				"http://127.0.0.1:5000/user",
				config
			);
			return response;
		} catch (error) {
			return false;
		}
	}

	async function fetchPendingRestaurants() {
		try {
			const response = await axios.get(
				"http://127.0.0.1:5000/restaurants/pending"
			);
			return response.data;
		} catch (error) {
			return false;
		}
	}

	async function fetchVerifiedRestaurants() {
		try {
			const response = await axios.get(
				"http://127.0.0.1:5000/restaurants/verified"
			);
			return response.data;
		} catch (error) {
			return false;
		}
	}

	useEffect(() => {
		if (typeof cookies.auth_token === "string") {
			try {
				const email = jwtDecode(cookies.auth_token)?.email;
				if (email) {
					setUserEmail(email);
				}
			} catch (err) {
				console.error("Invalid JWT token:", err);
			}
		}
	}, [cookies.auth_token]);

	async function fetchPendingRestaurantsByEmail() {
		try {
			const response = await axios.get(
				`http://127.0.0.1:5000/restaurants/pending/owner/${userEmail}`
			);
			return response.data;
		} catch (error) {
			console.error(
				`Failed to fetch pending restaurants for ${userEmail}:`,
				error
			);
			return false;
		}
	}

	async function fetchVerifiedRestaurantsByEmail() {
		try {
			const response = await axios.get(
				`http://127.0.0.1:5000/restaurants/verified/owner/${userEmail}`
			);
			return response.data;
		} catch (error) {
			console.error(
				`Failed to fetch verified restaurants for ${userEmail}:`,
				error
			);
			return false;
		}
	}

	useEffect(() => {
		if (Object.keys(user).length === 0) {
			/* user got overridden so we have to reset it again
		  call the token to get the user data from backend
		  that way we can reset the user and user info stays
		  whenever page reloads/re-renders */
			if (cookies.auth_token !== undefined) {
				fetchUser().then((result) => {
					if (result) {
						setUser(result.data);
					}
				});
			}
		}
	}, [user]);

	useEffect(() => {
		fetchPendingRestaurants().then((result) => {
			setPendingRestaurants(result);
		});
		fetchVerifiedRestaurants().then((result) => {
			setVerifiedRestaurants(result);
		});
		if (userEmail) {
			fetchPendingRestaurantsByEmail().then((result) => {
				if (result) {
					setPendingRestaurantsByEmail(result);
				}
			});
			fetchVerifiedRestaurantsByEmail().then((result) => {
				if (result) {
					setVerifiedRestaurantsByEmail(result);
				}
			});
		}
	}, [userEmail]);

	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<StartLogin />} />
				<Route
					path="/admin-dash"
					element={
							<PrivateRoute role="Admin" userStatus={user.status}>
								<AdminDash
									pendingRestaurants={pendingRestaurants}
									setPendingRestaurants={setPendingRestaurants}
									fetchPendingRestaurants={fetchPendingRestaurants}
									verifiedRestaurants={verifiedRestaurants}
									setVerifiedRestaurants={setVerifiedRestaurants}
									fetchVerifiedRestaurants={fetchVerifiedRestaurants}
									alertMessages={alertMessages}
									setAlertMessages={setAlertMessages}
								/>
							</PrivateRoute>
					}
				/>
				<Route 
					path="/admin-analytics" 
					element={
						<PrivateRoute role="Admin" userStatus={user.status}>
							<AdminAnalytics />
						</PrivateRoute>
					} 
				/>
				<Route
					path="/log-in"
					element={
						<Login
							handleLoginIn={updateUser}
							alertMessages={alertMessages}
							setAlertMessages={setAlertMessages}
						/>
					}
				/>
				<Route
					path="/register"
					element={
						<Register
							alertMessages={alertMessages}
							setAlertMessages={setAlertMessages}
						/>
					}
				/>
				<Route
					path="/customer-profile"
					element={
						<PrivateRoute role="Customer" userStatus={user.status}>
							<CustomerProfile />
						</PrivateRoute>
					}
				/>
				<Route
					path="/restaurant-manager-home"
					element={
							<PrivateRoute role="RestaurantManager" userStatus={user.status}>
								<RestaurantManagerHome
									pendingRestaurantsByEmail={
										pendingRestaurantsByEmail
									}
									verifiedRestaurantsByEmail={
										verifiedRestaurantsByEmail
									}
									setAlertMessages={setAlertMessages}
								/>
							</PrivateRoute>
					}
				/>
				<Route
					path="/restaurant-manager-add-restaurant"
					element={
							<PrivateRoute role="RestaurantManager" userStatus={user.status}>
								<RestaurantManagerAddRestaurant userEmail={userEmail} />
							</PrivateRoute>
					}
				/>
				<Route
					path="/restaurant-manager-add-menu/:id"
					element={
						<PrivateRoute
							role="RestaurantManager"
							userStatus={user.status}
						>
							<RestaurantManagerAddMenu
								alertMessages={alertMessages}
								setAlertMessages={setAlertMessages}
							/>
						</PrivateRoute>
					}
				/>
				<Route path="/book-table" element={<BookTablePage />} />
				<Route path="/restaurant/:id" element={<Restaurant />} />
				<Route
					path="/reservation-confirmation"
					element={<ReservationConfirmation />}
				/>
				<Route
					path="/restaurant-manager-update-restaurant/:id"
					element={
							<PrivateRoute role="RestaurantManager" userStatus={user.status}>
								<RestaurantManagerUpdateRestaurant />
							</PrivateRoute>
					}
				/>
				<Route
					path="/restaurant-manager-restaurant-bookings/:id"
					element={
							<PrivateRoute role="RestaurantManager" userStatus={user.status}>
								<RestaurantManagerRestaurantBookings />
							</PrivateRoute>
					}
				/>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
