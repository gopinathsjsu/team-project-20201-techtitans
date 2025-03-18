import React from "react";
import "./Menu.css";

const sampleMenuItems = [
	{ name: "Item 1", imageUrl: "path/to/item1.jpg" },
	{ name: "Item 2", imageUrl: "path/to/item2.jpg" },
	{ name: "Item 3", imageUrl: "path/to/item3.jpg" },
];

const Menu = ({ items = sampleMenuItems }) => {
	return (
		<section id="menu" className="restaurant-section">
			<h2>Menu</h2>
			<div className="menu">
				{items.map((item, index) => (
					<div key={index} className="menu-item">
						<img src={item.imageUrl} alt={item.name} />
						<p>{item.name}</p>
					</div>
				))}
			</div>
		</section>
	);
};

export default Menu;
