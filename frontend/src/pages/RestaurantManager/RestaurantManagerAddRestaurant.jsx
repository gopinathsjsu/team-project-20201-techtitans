import Navbar from "../../components/Navbar/Navbar";
import AddRestaurant from "../../components/AddRestaurant/AddRestaurant";

function RestaurantManagerAddRestaurant({user}) {
	return (
		<>
			<Navbar role="restaurant-manager" />
			<AddRestaurant userEmail={user?.email}/>
		</>
	);
}

export default RestaurantManagerAddRestaurant;
