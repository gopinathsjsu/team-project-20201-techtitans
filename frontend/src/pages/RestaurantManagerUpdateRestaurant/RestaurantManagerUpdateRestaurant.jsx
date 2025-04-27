import Navbar from "../../components/Navbar/Navbar";
import { useParams } from "react-router-dom";
import RestaurantForm from "../../components/RestaurantForm/RestaurantForm";

function RestaurantManagerUpdateRestaurant() {
	const { id } = useParams();
	return (
		<>
			<Navbar role="restaurant-manager" />
			<RestaurantForm restaurantId={id} userEmail={null} />
		</>
	);
}

export default RestaurantManagerUpdateRestaurant;
