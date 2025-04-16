import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import AddMenu from "../../components/Menu/AddMenu";
import "./RestaurantManagerAdd.css";

function RestaurantManagerAddMenu(props) {
	const { alertMessages, setAlertMessages } = props;
	const { id } = useParams();

	return (
		<div className="rest-man-add-screen">
			<Navbar role="restaurant-manager" />
			<AddMenu
				id={id}
				alertMessages={alertMessages}
				setAlertMessages={setAlertMessages}
			/>
		</div>
	);
}

export default RestaurantManagerAddMenu;
