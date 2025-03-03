import express from "express";
import cors from "cors";
import { addRestaurant } from "./models/restaurantServices.js";

const app = express();
const PORT = 5173;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
	res.send("Server is ready");
});

app.get("/restaurants", async (req, res) => {
	res.send("Get Request");
});

app.post("/restaurants", async (req, res) => {
	const restaurant = req.body;
	const savedRestaurant = await addRestaurant(restaurant);
	// check for duplicate restaurants later
	if (savedRestaurant) {
		res.status(201).send(savedRestaurant);
	} else {
		res.status(500).end();
	}
});

app.listen(PORT, () => {
	console.log(`Server started at http://localhost:${PORT}`);
});
