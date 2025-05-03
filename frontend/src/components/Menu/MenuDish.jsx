import { useRef, useState } from "react";
import axios from "axios";
import "./Menu.css";

function MenuDish(props) {
	const { id, dishList, setDishList } = props;
	const fileInputRef = useRef(null);

	function handleChange(event) {
		const { value } = event.target;
		let updatedDishes = [...dishList];
		const idx = updatedDishes.findIndex((dish) => dish.dishId === id);

		if (idx !== -1) {
			updatedDishes[idx] = {
				...updatedDishes[idx],
				[event.target.name]: value,
			};
			setDishList(updatedDishes);
		}
	}

	// Later: Field for a Highlight Dish
	const removeDish = () => {
		let updatedDishes = dishList.filter((dish) => dish.dishId !== id);
		setDishList(updatedDishes);
	};

	const handleImageInsert = async (e) => {
		const files = e.target.files;
		if (!files || files.length === 0) return;

		let uploadedUrl = "";
		let updatedDishes = [...dishList];
		const idx = updatedDishes.findIndex((dish) => dish.dishId === id);

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
	};

	return (
		<div className="update-restaurant-restaurant-form">
			<label className="update-restaurant-form-group">
				Dish Name:
				<input
					type="text"
					name="name"
					placeholder="Enter dish name..."
					onChange={handleChange}
				/>
			</label>
			<label className="update-restaurant-form-group">
				Description:
				<textarea
					type="text"
					name="description"
					placeholder="Enter a description..."
					className="update-restaurant-description-text"
					onChange={handleChange}
				></textarea>
			</label>
			<label className="update-restaurant-form-group">
				Cost:
				<input
					type="number"
					name="cost"
					placeholder="Enter dish cost..."
					onChange={handleChange}
				/>
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
				{dishList.find((dish) => dish.dishId === id)?.photo.length >
					0 && (
					<p style={{ color: "green", marginBottom: "10px" }}>
						Photo added. 👍
					</p>
				)}
			</div>
		</div>
	);
}

export default MenuDish;
