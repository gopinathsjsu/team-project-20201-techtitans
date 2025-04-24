import Navbar from "../../components/Navbar/Navbar";
import { useParams } from "react-router-dom";
import UpdateRestaurant from "../../components/UpdateRestaurant/UpdateRestaurant";

function RestaurantManagerUpdateRestaurant() {
	const { id } = useParams();
	return (
		<>
			<Navbar role="restaurant-manager" />
			<UpdateRestaurant restaurantId={id} />
		</>
	);
}

export default RestaurantManagerUpdateRestaurant;
