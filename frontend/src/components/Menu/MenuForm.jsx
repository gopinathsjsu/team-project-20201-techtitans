import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import MenuDish from "./MenuDish";
import AlertMessage from "../AlertMessage";

function MenuForm(props) {
	const { id, restaurantId, alertMessages, setAlertMessages } = props;
	const navigate = useNavigate();
	const [cookies] = useCookies(["auth_token"]);

	const [menu, setMenu] = useState(
		id
			? null
			: {
					restaurantId: restaurantId,
					title: "",
					dishes: [],
				}
	);
	const [dishList, setDishList] = useState([]);
	const [error, setError] = useState({});
	const [isDisable, setDisable] = useState(false);

	useEffect(() => {
		const fetchMenu = async () => {
			try {
				const response = await axios.get(
					`http://localhost:5000/menu/get/${id}`
				);
				if (response.data) {
					setMenu(response.data);

					response.data.dishes.forEach((dish) => {
						dish.cost =
							dish.cost["$numberDecimal"].toLocaleString();
					});
					setDishList(response.data.dishes);
				} else {
					console.error("No menu data received");
				}
			} catch (error) {
				console.error("Could not receive menu data");
			}
		};
		if (id) {
			fetchMenu();
		}
	}, []);

	const addDish = () => {
		const dish = {
			_id: uuidv4(),
			name: "",
			description: "",
			cost: 0,
			photo: "",
			isHighlightDish: false,
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

		const emptyHighlightPhotos = dishList.filter(
			(dish) => dish.isHighlightDish == true && dish.photo == ""
		);
		if (emptyHighlightPhotos.length > 0) {
			errors.highlight = "A Highlighted Dish must have a photo.";
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
			dishList.forEach((dish) => {
				delete dish._id;
			});

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

	async function makeUpdateMenuCall(menu) {
		try {
			const config = {
				headers: { Authorization: `Bearer ${cookies.auth_token}` },
			};
			dishList.forEach((dish) => {
				delete dish._id;
			});

			const updatedMenu = {
				...menu,
				dishes: [...dishList],
			};
			setMenu(updatedMenu);

			const response = await axios.patch(
				`http://127.0.0.1:5000/menu/update/${id}`,
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
			setDisable(true);
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

	function updateMenu() {
		if (validate()) {
			setDisable(true);
			makeUpdateMenuCall(menu).then((result) => {
				if (result && result.status === 201) {
					navigate("/restaurant-manager-home");
					window.location.reload();
					setAlertMessages({
						isOpen: true,
						message: "Menu successfully updated!",
						type: "success",
					});
				} else {
					setAlertMessages({
						isOpen: true,
						message: "Invalid input. Unable to update menu.",
						type: "error",
					});
				}
			});
		}
	}

	if (id && !menu) {
		return (
			<>
				<div className="update-restaurant-restaurant-form">
					Loading Menu Details...
				</div>
			</>
		);
	}

	return (
		<>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					if (!isDisable) {
						if (id) {
							updateMenu();
						} else {
							createMenu();
						}
					}
				}}
			>
				<div className="update-restaurant-restaurant-form">
					<h2 className="update-restaurant-form-group">
						Menu Title:
						<input
							type="text"
							name="title"
							placeholder={id ? menu.title : "Enter Menu Title"}
							onChange={handleTitle}
						/>
					</h2>
					{dishList &&
						dishList.map((dish) => (
							<MenuDish
								key={dish._id}
								id={dish._id}
								dishList={dishList}
								setDishList={setDishList}
							/>
						))}
					{error.emptyFields && (
						<p style={{ color: "red" }}>
							Error: {error.emptyFields}
						</p>
					)}
					<button
						type="button"
						className="add-dish-btn"
						onClick={addDish}
					>
						Add Dish
					</button>
					{error.dishes && (
						<p style={{ color: "red" }}>Error: {error.dishes}</p>
					)}
					{error.highlight && (
						<p style={{ color: "red" }}>Error: {error.highlight}</p>
					)}
					<button className="submit-menu-btn">
						{id ? "Update Menu" : "Create Menu"}
					</button>
					<AlertMessage
						alertMessages={alertMessages}
						setAlertMessages={setAlertMessages}
					/>
				</div>
			</form>
		</>
	);
}

export default MenuForm;
