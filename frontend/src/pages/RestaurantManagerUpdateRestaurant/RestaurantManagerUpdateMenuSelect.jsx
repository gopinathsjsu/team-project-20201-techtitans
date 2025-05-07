import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar/Navbar";
import "./RestaurantManagerSelector.css";

function RestaurantManagerUpdateMenuSelect() {
	const navigate = useNavigate();
	const { restaurantId } = useParams();
	const [menus, setMenus] = useState([]);
	const [id, setId] = useState("");

	useEffect(() => {
		const fetchMenus = async () => {
			try {
				const response = await axios.get(
					`http://http://restaurant-api-alb-405497354.us-east-2.elb.amazonaws.com/menu/${restaurantId}`
				);
				if (response.data) {
					setMenus(response.data);
					setId(response.data[0]._id);
				} else {
					console.error("No menu data received");
				}
			} catch (error) {
				console.error("Could not receive menu data");
			}
		};
		fetchMenus();
	}, []);

	const handleSelect = () => {
		navigate(`/restaurant-manager-update-menu/${restaurantId}/${id}`);
	};

	return (
		<div className="rest-man-add-screen">
			<Navbar role="restaurant-manager" />
			<div className="form-group">
				<h2 className="title">Menu</h2>
				<select
					name="menu"
					value={id}
					onChange={(e) => setId(e.target.value)}
				>
					{menus.length === 0 ? (
						<option value="">No Menus Found</option>
					) : (
						menus.map((menu, idx) => (
							<option key={idx} value={menu._id}>
								{menu.title}
							</option>
						))
					)}
				</select>
			</div>
			<button type="button" className="select-btn" onClick={handleSelect}>
				Select
			</button>
		</div>
	);
}

export default RestaurantManagerUpdateMenuSelect;
