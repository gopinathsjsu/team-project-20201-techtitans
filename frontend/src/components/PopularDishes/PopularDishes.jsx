import { Carousel } from "antd";
import { Card, CardMedia, CardContent, Typography, Box } from "@mui/material";
import "./PopularDishes.css";

function PopularDishes(props) {
	const { menus } = props;
	const popularDishes = menus
		.flatMap((menu) => menu.dishes)
		.filter((dish) => dish.isHighlightDish === true);

	const popularDishesCarousel = (
		<Carousel arrows>
			{popularDishes.map((dish, idx) => (
				<Card
					key={idx}
					sx={{
						maxHeight: 600,
						maxWidth: 770,
						backgroundColor: "transparent",
						color: "white",
						border: "2px solid white",
					}}
				>
					<CardContent
						sx={{
							backgroundColor: "transparent",
							textAlign: "center",
						}}
					>
						<Typography variant="h6">{dish.name}</Typography>
					</CardContent>
					<hr className="divider" />
					<CardMedia
						component="img"
						height="600"
						image={dish.photo}
						alt={dish.name}
					/>
				</Card>
			))}
		</Carousel>
	);

	return (
		<Box sx={{ margin: "0 auto", mt: 4 }}>
			<h2>Popular Dishes</h2>
			{popularDishesCarousel}
		</Box>
	);
}

export default PopularDishes;
