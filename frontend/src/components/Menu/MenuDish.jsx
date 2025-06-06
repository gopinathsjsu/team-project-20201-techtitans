import { useRef, useState } from "react";
import axios from "axios";
import "./Menu.css";
import InfoOutlineIcon from "@mui/icons-material/InfoOutlined";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

function MenuDish(props) {
	const { id, dishList, setDishList } = props;
	const dish = dishList.find((d) => d._id == id);
	const fileInputRef = useRef(null);
	const [loading, setLoading] = useState(false);

	function handleChange(event) {
		const { value } = event.target;
		let updatedDishes = [...dishList];
		const idx = updatedDishes.findIndex((dish) => dish._id === id);

		if (idx !== -1) {
			updatedDishes[idx] = {
				...updatedDishes[idx],
				[event.target.name]: value,
			};

			if (event.target.name == "isHighlightDish") {
				if (dish.isHighlightDish && value === "on") {
					updatedDishes[idx] = {
						...updatedDishes[idx],
						[event.target.name]: false,
					};
				} else {
					updatedDishes[idx] = {
						...updatedDishes[idx],
						[event.target.name]: true,
					};
				}
			}
		}
		setDishList(updatedDishes);
	}

	const removeDish = () => {
		let updatedDishes = dishList.filter((dish) => dish._id !== id);
		setDishList(updatedDishes);
	};

	const handleImageInsert = async (e) => {
		setLoading(true);
		const files = e.target.files;
		if (!files || files.length === 0) return;

		let uploadedUrl = "";
		let updatedDishes = [...dishList];
		const idx = updatedDishes.findIndex((dish) => dish._id === id);

		const formData = new FormData();
		formData.append("image", files[0]);

		try {
			const res = await axios.post(
				"http://localhost:5000/upload",
				formData
			);
			uploadedUrl = res.data.fileUrl;
		} catch (err) {
			console.error("Error uploading image:", err);
		}

		updatedDishes[idx] = {
			...dishList[idx],
			photo: uploadedUrl,
		};
		setDishList(updatedDishes);
		setLoading(false);
	};

	return (
		<div className="update-restaurant-restaurant-form">
			<label className="update-restaurant-form-group">
				Dish Name:
				<input
					type="text"
					name="name"
					placeholder={dish.name ? dish.name : "Enter dish name..."}
					onChange={handleChange}
				/>
			</label>
			<label className="update-restaurant-form-group">
				Description:
				<textarea
					type="text"
					name="description"
					placeholder={
						dish.description
							? dish.description
							: "Enter a description..."
					}
					className="update-restaurant-description-text"
					onChange={handleChange}
				></textarea>
			</label>
			<label className="update-restaurant-form-group">
				Cost:
				<input
					type="number"
					step="any"
					name="cost"
					placeholder={dish.cost ? dish.cost : "Enter dish cost..."}
					onChange={handleChange}
				/>
			</label>
			<label className="menu-highlight-label" for="isHighlightDish">
				<input
					type="checkbox"
					name="isHighlightDish"
					checked={dish.isHighlightDish ? true : false}
					onChange={handleChange}
				/>
				Would you like to make this a featured dish?
				<Tooltip
					title="This will be placed in a highlight gallery as a popular dish
				on your restaurant's page."
				>
					<IconButton>
						<InfoOutlineIcon style={{ color: "white" }} />
					</IconButton>
				</Tooltip>
			</label>
			<div>
				<button className="remove-dish-btn" onClick={removeDish}>
					Remove Dish
				</button>
				<input
					type="file"
					multiple
					accept="image/*"
					onChange={handleImageInsert}
					style={{ display: "none" }}
					ref={fileInputRef}
				/>
				<button
					type="button"
					className="update-restaurant-insert-pics-btn"
					onClick={() => fileInputRef.current.click()}
				>
					Insert Image
				</button>

				<div style={{ display: loading ? "block" : "none" }}>
					Loading image...
				</div>
				<div style={{ display: loading ? "none" : "block" }}>
					<div className="update-restaurant-photos-preview">
						{dishList.find((dish) => dish._id === id)?.photo
							.length > 0 ? (
							<img
								src={dish.photo}
								alt="Menu Item"
								className="photo-thumbnail"
							/>
						) : (
							<></>
						)}
					</div>
					{dishList.find((dish) => dish._id === id)?.photo.length >
						0 && (
						<p style={{ color: "green", marginBottom: "10px" }}>
							Photo added. 👍
						</p>
					)}
				</div>
			</div>
		</div>
	);
}

export default MenuDish;
