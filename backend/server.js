import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { addRestaurant } from "./models/restaurantServices.js";
import { addUser, findUserByUsername } from "./models/userServices.js";
import {
	addReservation,
	getReservationsByUserId,
	getReservationsByRestaurantId,
} from "./models/reservationServices.js";
import {
	addReview,
	getReviewsByRestaurantId,
} from "./models/reviewServices.js";
import { addImage, getImagesByRestaurantId } from "./models/galleryServices.js";

dotenv.config();
console.log("MONGODB_URI:", process.env.MONGODB_URI);

const app = express();
const PORT = 5173;

app.use(cors());
app.use(express.json());

mongoose
	.connect(process.env.MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("MongoDB connected"))
	.catch((err) => console.log(err));

app.get("/", (req, res) => {
	res.send("Server is ready");
});

app.get("/users", async (req, res) => {
	res.send("Get Request");
});

app.post("/users", async (req, res) => {
	const user = req.body;
	const { email } = user;
	const { password } = user;

	if (!email) {
		res.status(400).send("Bad request: Invalid input for email.");
	} else if (!password) {
		res.status(400).send("Bad request: Invalid input for password.");
	} else {
		const salt = await bcrypt.genSalt(10);
		const hashedPwd = await bcrypt.hash(password, salt);
		const savedUser = await addUser(user, hashedPwd);

		// generate access token in the future
		if (savedUser && savedUser != "existing user") {
			res.status(201).send(savedUser);
		} else if (savedUser == "existing user") {
			res.status(401).end();
		} else {
			res.status(500).end();
		}
	}
});

app.post("/log-in", async (req, res) => {
	const user = req.body;
	const { username } = user;
	const { password } = user;

	const savedUser = await findUserByUsername(username);
	if (!savedUser) {
		res.status(401).send("Unauthorized request: Invalid username.");
	} else {
		const isValidUser = await bcrypt.compare(password, savedUser.password);
		if (isValidUser) {
			// generate access token in the future
			res.status(201).send(savedUser);
		} else {
			res.status(401).send("Unauthorized request: Invalid Password");
		}
	}
});

app.get("/restaurants", async (req, res) => {
	res.send("Get Request");
});

app.post("/restaurants", async (req, res) => {
	const restaurant = req.body;
	const savedRestaurant = await addRestaurant(restaurant);
	if (savedRestaurant && savedRestaurant != "existing restaurant") {
		res.status(201).send(savedRestaurant);
	} else {
		res.status(500).end();
	}
});

app.post("/reservations", async (req, res) => {
	try {
		const reservation = req.body;
		const result = await addReservation(reservation);
		if (result) {
			res.status(201).json(result);
		} else {
			res.status(500).end();
		}
	} catch (error) {
		res.status(500).send("Internal Server Error");
	}
});

app.get("/reservations/user/:userId", async (req, res) => {
	try {
		const userId = req.params.userId;
		const result = await getReservationsByUserId(userId);
		if (result) {
			res.status(200).json(result);
		} else {
			res.status(404).send("Reservations not found");
		}
	} catch (error) {
		res.status(500).send("Internal Server Error");
	}
});

app.get("/reservations/restaurant/:restaurantId", async (req, res) => {
	try {
		const restaurantId = req.params.restaurantId;
		const result = await getReservationsByRestaurantId(restaurantId);
		if (result) {
			res.status(200).json(result);
		} else {
			res.status(404).send("Reservations not found");
		}
	} catch (error) {
		res.status(500).send("Internal Server Error");
	}
});

app.post("/reviews", async (req, res) => {
	try {
		const review = req.body;
		const result = await addReview(review);
		if (result) {
			res.status(201).json(result);
		} else {
			res.status(500).end();
		}
	} catch (error) {
		res.status(500).send("Internal Server Error");
	}
});

app.get("/reviews/restaurant/:restaurantId", async (req, res) => {
	try {
		const restaurantId = req.params.restaurantId;
		const result = await getReviewsByRestaurantId(restaurantId);
		if (result) {
			res.status(200).json(result);
		} else {
			res.status(404).send("Reviews not found");
		}
	} catch (error) {
		res.status(500).send("Internal Server Error");
	}
});

app.post("/gallery", async (req, res) => {
	try {
		const image = req.body;
		const result = await addImage(image);
		if (result) {
			res.status(201).json(result);
		} else {
			res.status(500).end();
		}
	} catch (error) {
		res.status(500).send("Internal Server Error");
	}
});

app.get("/gallery/restaurant/:restaurantId", async (req, res) => {
	try {
		const restaurantId = req.params.restaurantId;
		const result = await getImagesByRestaurantId(restaurantId);
		if (result) {
			res.status(200).json(result);
		} else {
			res.status(404).send("Images not found");
		}
	} catch (error) {
		res.status(500).send("Internal Server Error");
	}
});
