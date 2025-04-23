import Navbar from "../../components/Navbar/Navbar";
import RestaurantForm from "../../components/RestaurantForm/RestaurantForm";

function RestaurantManagerAddRestaurant(props) {
	const { userEmail } = props;
	return (
		<>
			<Navbar role="restaurant-manager" />
			<RestaurantForm restaurantId={null} userEmail={userEmail} />
		</>
	);
}

export default RestaurantManagerAddRestaurant;
