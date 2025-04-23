import { useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import MenuDish from "./MenuDish";
import AlertMessage from "../AlertMessage";

function AddMenu(props) {
	const { id, alertMessages, setAlertMessages } = props;
	const navigate = useNavigate();
	const [cookies] = useCookies(["auth_token"]);

	const [menu, setMenu] = useState({
		restaurantId: id,
		title: "",
		dishes: [],
	});
	const [dishList, setDishList] = useState([]);
	const [error, setError] = useState({});

	const addDish = () => {
		const dish = {
			dishId: uuidv4(),
			name: "",
			description: "",
			cost: 0,
			photo: "",
		};
		setDishList([...dishList, dish]);
	};

	function handleTitle(event) {
		const { value } = event.target;
		setMenu({
			...menu,
			[event.target.name]: value,
		});
	}

	function validate() {
		let bool = true;
		const errors = {};
		if (!dishList.length || dishList.length == 0) {
			errors.dishes = "Dishes must be added to create a menu.";
			bool = false;
		}

		const emptyDishes = dishList.filter(
			(dish) =>
				dish.name == "" || dish.description == "" || dish.cost <= 0
		);
		if (emptyDishes.length > 0) {
			errors.emptyFields =
				"Dishes must have a name, description, and cost.";
			bool = false;
		}
		setError(errors);
		return bool;
	}

	async function makeMenuCall() {
		try {
			const config = {
				headers: { Authorization: `Bearer ${cookies.auth_token}` },
			};

			const updatedMenu = {
				...menu,
				dishes: [...dishList],
			};
			setMenu(updatedMenu);

			const response = await axios.post(
				"http://127.0.0.1:5000/menu",
				updatedMenu,
				config
			);
			return response;
		} catch (error) {
			return error;
		}
	}

	function createMenu() {
		if (validate()) {
			makeMenuCall().then((result) => {
				if (result && result.status === 201) {
					navigate("/restaurant-manager-home");
					window.location.reload();
					setAlertMessages({
						isOpen: true,
						message: "Menu successfully created!",
						type: "success",
					});
				} else {
					setAlertMessages({
						isOpen: true,
						message: "Invalid input. Unable to add menu.",
						type: "error",
					});
				}
			});
		}
	}

	return (
		<div className="update-restaurant-restaurant-form">
			<h2 className="update-restaurant-form-group">
				Menu Title:
				<input
					type="text"
					name="title"
					placeholder="Enter Menu Title"
					onChange={handleTitle}
				/>
			</h2>
			{dishList &&
				dishList.map((dish) => (
					<MenuDish
						key={dish.dishId}
						id={dish.dishId}
						dishList={dishList}
						setDishList={setDishList}
					/>
				))}
			{error.emptyFields && (
				<p style={{ color: "red" }}>Error: {error.emptyFields}</p>
			)}
			<button className="add-dish-btn" onClick={addDish}>
				Add Dish
			</button>
			{error.dishes && (
				<p style={{ color: "red" }}>Error: {error.dishes}</p>
			)}
			<button className="submit-menu-btn" onClick={createMenu}>
				Create Menu
			</button>
			<AlertMessage
				alertMessages={alertMessages}
				setAlertMessages={setAlertMessages}
			/>
		</div>
	);
}

export default AddMenu;
