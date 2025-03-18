import React from "react";
import "./PopularDishes.css";

const sampleDishes = [
	{ name: "Dish A", imageUrl: "path/to/dishA.jpg" },
	{ name: "Dish B", imageUrl: "path/to/dishB.jpg" },
	{ name: "Dish C", imageUrl: "path/to/dishC.jpg" },
	{ name: "Dish D", imageUrl: "path/to/dishD.jpg" },
	{ name: "Dish E", imageUrl: "path/to/dishE.jpg" },
];

const PopularDishes = ({ dishes = sampleDishes }) => {
	return (
		<section id="popular-dishes" className="restaurant-section">
			<h2>Popular Dishes</h2>
			<div className="popular-dishes">
				{dishes.map((dish, index) => (
					<div key={index} className="dish">
						<img src={dish.imageUrl} alt={dish.name} />
						<p>{dish.name}</p>
					</div>
				))}
			</div>
		</section>
	);
};

export default PopularDishes;
