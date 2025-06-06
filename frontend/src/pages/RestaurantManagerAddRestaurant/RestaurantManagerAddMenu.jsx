import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import MenuForm from "../../components/Menu/MenuForm";
import "./RestaurantManagerAdd.css";

function RestaurantManagerAddMenu(props) {
	const { alertMessages, setAlertMessages } = props;
	const { restaurantId } = useParams();

	return (
		<div className="rest-man-add-screen">
			<Navbar role="restaurant-manager" />
			<MenuForm
				id={null}
				restaurantId={restaurantId}
				alertMessages={alertMessages}
				setAlertMessages={setAlertMessages}
			/>
		</div>
	);
}

export default RestaurantManagerAddMenu;
