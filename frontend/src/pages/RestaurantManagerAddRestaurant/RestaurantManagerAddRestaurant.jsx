import Navbar from "../../components/Navbar/Navbar";
import AddRestaurant from "../../components/AddRestaurant/AddRestaurant";

function RestaurantManagerAddRestaurant(props) {
	const { userEmail } = props;
	return (
		<>
			<Navbar role="restaurant-manager" />
			<AddRestaurant userEmail={userEmail} />
		</>
	);
}

export default RestaurantManagerAddRestaurant;
