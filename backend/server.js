import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
	addUser,
	findUserByEmail,
	findUserByUsername,
} from "./models/userServices.js";
import {
	addRestaurant,
	updateRestaurantStatus,
	getVerifiedRestaurants,
	getPendingRestaurants,
	getRestaurants,
	getRestaurantById,
} from "./models/restaurantServices.js";
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

const app = express();
const PORT = 5173;

app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
	console.log(`Server started at http://localhost:${PORT}`);
});

function authenticateUser(req, res, next) {
	const authHeader = req.headers.authorization;
	const token = authHeader && authHeader.split(" ")[1];

	if (!token) {
		return res.status(401).end();
	}

	try {
		next();
	} catch (error) {
		return res.status(401).end();
	}
}

function generateAccessToken(email) {
	// change the token duration for your testing
	return jwt.sign({ email }, process.env.TOKEN_SECRET, { expiresIn: "10s" });
}

app.get("/", (req, res) => {
	res.send("Server is ready");
});

app.get("/user", authenticateUser, async (req, res) => {
	const authHeader = req.headers.authorization;
	const token = authHeader && authHeader.split(" ")[1];
	try {
		const decodedUser = jwt.verify(token, process.env.TOKEN_SECRET);
		const { email } = decodedUser;
		const user = await findUserByEmail(email);
		res.send(user);
	} catch (error) {
		res.status(500).send("Unable to fetch given user.");
	}
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
			const token = generateAccessToken(savedUser.email);
			res.status(201).send({ token, savedUser });
		} else {
			res.status(401).send("Unauthorized request: Invalid Password");
		}
	}
});

app.get("/restaurants", async (req, res) => {
	try {
		const result = await getRestaurants();
		if (result && result.length > 0) {
			res.status(200).json(result);
		} else {
			res.status(404).send("No restaurants found");
		}
	} catch (error) {
		res.status(500).send("Internal Server Error");
	}
});

app.get("/restaurants/verified", async (req, res) => {
	try {
		const result = await getVerifiedRestaurants();
		res.status(201).send(result);
	} catch (error) {
		res.status(500).send("Unable to fetch verified restaurants.");
	}
});

app.get("/restaurants/pending", async (req, res) => {
	try {
		const result = await getPendingRestaurants();
		res.status(201).send(result);
	} catch (error) {
		res.status(500).send("Unable to fetch pending restaurants.");
	}
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

app.patch("/restaurants/:name", async (req, res) => {
	const { name } = req.params;
	const updates = req.body;
	let result = null;
	if (updates.updateStatus != undefined || updates.updateStatus != null) {
		result = await updateRestaurantStatus(name, updates.updateStatus);
	}

	if (result === undefined || result === null) {
		res.status(404).send("Resource not found.");
	} else {
		res.status(201).send(result);
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

app.get("/restaurants/:id", async (req, res) => {
	try {
		const restaurantId = req.params.id;
		const result = await getRestaurantById(restaurantId);

		if (result) {
			res.status(200).json(result);
		} else {
			res.status(404).send("Restaurant not found");
		}
	} catch (error) {
		res.status(500).send("Internal Server Error");
	}
});
