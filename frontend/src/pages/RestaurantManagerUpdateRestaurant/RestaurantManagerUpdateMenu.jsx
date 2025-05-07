import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import MenuForm from "../../components/Menu/MenuForm";

function RestaurantManagerUpdateMenu(props) {
	const { alertMessages, setAlertMessages } = props;
	const { id, restaurantId } = useParams();

	return (
		<div className="rest-man-add-screen">
			<Navbar role="restaurant-manager" />
			<MenuForm
				id={id}
				restaurantId={restaurantId}
				alertMessages={alertMessages}
				setAlertMessages={setAlertMessages}
			/>
		</div>
	);
}

export default RestaurantManagerUpdateMenu;
