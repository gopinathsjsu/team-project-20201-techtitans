import { useState, useEffect } from "react";
import axios from "axios";
import "./Menu.css";

function Menu(props) {
	const { id } = props;
	const [menus, setMenus] = useState([]);

	async function fetchMenus() {
		try {
			const response = await axios.get(
				`http://127.0.0.1:5000/menu/${id}`
			);
			return response;
		} catch (error) {
			return false;
		}
	}

	useEffect(() => {
		fetchMenus().then((result) => {
			setMenus(result.data);
		});
	}, [menus]);

	const menuDetails = menus.map((menu) => (
		<div className="menu">
			<h4 className="menu-title">{menu.title}</h4>
			<div>
				{menu.dishes.map((item, idx) => (
					<>
						<div className="menu-item">
							<b className="item-text">{item.name}</b>
							<b className="item-price">
								{item.cost["$numberDecimal"].toLocaleString()}
							</b>
						</div>
						<p className="item-text">{item.description}</p>
						<img src={item.photo} alt="" />
					</>
				))}
			</div>
		</div>
	));

	return (
		<section id="menu" className="restaurant-section">
			<h2>Menus</h2>
			{menuDetails}
		</section>
	);
}

export default Menu;
