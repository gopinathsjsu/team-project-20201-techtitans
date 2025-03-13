import "./RestaurantManagerAddRestaurant.css";
import Navbar from "../../components/Navbar/Navbar";
import AddRestaurant from "../../components/AddRestaurant/AddRestaurant";

function RestaurantManagerAddRestaurant() {
	return (
		<>
			<Navbar role="restaurant-manager" />
			<AddRestaurant />
		</>
	);
}

export default RestaurantManagerAddRestaurant;
