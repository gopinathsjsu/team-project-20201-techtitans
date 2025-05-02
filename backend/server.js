import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
	addUser,
	findUserByEmail,
	findUserByUsername,
	findUserById,
} from "./models/userServices.js";
import {
	addRestaurant,
	updateRestaurantStatus,
	getVerifiedRestaurants,
	getPendingRestaurants,
	getRestaurants,
	getRestaurantById,
	getRestaurantsByEmail,
	getPendingRestaurantsByEmail,
	getVerifiedRestaurantsByEmail,
	removeRestaurant,
	updateRestaurantById,
} from "./models/restaurantServices.js";
import {
	addReservation,
	getReservationsByUserId,
	getReservationsByRestaurantId,
	removeReservations,
} from "./models/reservationServices.js";
import {
	addReview,
	getReviewsByRestaurantId,
	removeReviews,
} from "./models/reviewServices.js";
import { addImage, getImagesByRestaurantId } from "./models/galleryServices.js";
import {
	addMenu,
	getMenuByRestaurantId,
	removeMenus,
} from "./models/menuServices.js";
import {
	addTable,
	updateTableStatus,
	getAvailableTablesbyTime,
	removeTables,
	getTablesByRestaurantId,
} from "./models/tableServices.js";

import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

import upload, { uploadToS3 } from "./middleware/upload.js";

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const app = express();
const PORT = 5000;

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
	return jwt.sign({ email }, process.env.TOKEN_SECRET, { expiresIn: "24h" });
}

function parseTime(timeStr) {
	const [time, period] = timeStr.split(" ");
	let [hours, minutes] = time.split(":").map(Number);
	if (minutes === undefined) minutes = 0;
	if (period === "PM" && hours !== 12) hours += 12;
	if (period === "AM" && hours === 12) hours = 0;
	return hours * 60 + minutes;
}

function convertMinutesTo12Hour(totalMinutes) {
	const hrs24 = Math.floor(totalMinutes / 60);
	const mins = totalMinutes % 60;
	const period = hrs24 >= 12 ? "PM" : "AM";
	const hrs12 = hrs24 % 12 === 0 ? 12 : hrs24 % 12;
	return `${hrs12}:${mins.toString().padStart(2, "0")} ${period}`;
}

async function generateTablesForRestaurant(restaurant) {
	const tables = restaurant.tableSizes;
	const bookingDuration =
		parseInt(restaurant.bookingDuration.split(" ")[0], 10) * 60;
	const hours = Array.from(restaurant.hours);
	const openHours = hours.filter(([day, time]) => time !== "Closed");
	const slots = new Set();

	openHours.forEach(([day, time]) => {
		const [openTime, closeTime] = time.split(" - ");
		const openMinutes = parseTime(openTime);
		const closeMinutes = parseTime(closeTime);

		for (let t = openMinutes; t < closeMinutes; t += bookingDuration) {
			const slot =
				convertMinutesTo12Hour(t) +
				" - " +
				convertMinutesTo12Hour(t + bookingDuration);
			if (t + bookingDuration <= closeMinutes) {
				slots.add(slot);
			}
		}
	});

	for (const [tableKey, seats] of tables) {
		const tableNum = tableKey.split(" ")[1];
		for (const timeSlot of slots) {
			await addTable({
				tableNum,
				seats,
				timeSlot,
				restaurantId: restaurant._id,
			});
		}
	}
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
	const { email, username, password } = user;

	if (!email) {
		res.status(400).send("Bad request: Invalid input for email.");
	} else if (!password) {
		res.status(400).send("Bad request: Invalid input for password.");
	}
	try {
		const salt = await bcrypt.genSalt(10);
		const hashedPwd = await bcrypt.hash(password, salt);
		const savedUser = await addUser(user, hashedPwd);

		// generate access token in the future
		if (savedUser && savedUser != "existing user") {
			const msg = {
				to: email,
				from: "BookTable <isla2000@gmail.com>",
				subject: "Welcome to the BookTable!",
				text: `Hi ${username || "there"}, thanks for registering!`,
				html: `<strong>Hi ${username || "there"}, welcome </strong>`,
			};
			try {
				await sgMail.send(msg);
			} catch (emailError) {
				console.error("Error sending email:", emailError);
			}
			res.status(201).send(savedUser);
		} else if (savedUser == "existing user") {
			res.status(401).end();
		} else {
			res.status(500).end();
		}
	} catch (error) {
		console.error("Registration error:", error);
		return res
			.status(500)
			.send("Internal server error during registration.");
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

app.get("/restaurants/:id", async (req, res) => {
	try {
		const restaurantId = req.params.id;
		const restaurant = await getRestaurantById(restaurantId);

		if (!restaurant) {
			return res.status(404).send("Restaurant not found");
		}

		const reviews = await getReviewsByRestaurantId(restaurantId);
		restaurant.reviews = reviews || [];
		res.status(200).json(restaurant);
	} catch (error) {
		res.status(500).send("Internal Server Error");
	}
});

app.get("/restaurants/owner/:email", async (req, res) => {
	try {
		const restaurantManagerEmail = req.params.email;
		const result = await getRestaurantsByEmail(restaurantManagerEmail);
		res.status(201).send(result);
	} catch (error) {
		res.status(500).send(
			"Unable to fetch restaurants belonging to that email."
		);
	}
});

app.get("/restaurants/pending/owner/:email", async (req, res) => {
	try {
		const restaurantManagerEmail = req.params.email;
		const result = await getPendingRestaurantsByEmail(
			restaurantManagerEmail
		);
		res.status(201).send(result);
	} catch (error) {
		res.status(500).send(
			"Unable to fetch restaurants belonging to that email."
		);
	}
});

app.get("/restaurants/verified/owner/:email", async (req, res) => {
	try {
		const restaurantManagerEmail = req.params.email;
		const result = await getVerifiedRestaurantsByEmail(
			restaurantManagerEmail
		);
		res.status(201).send(result);
	} catch (error) {
		res.status(500).send(
			"Unable to fetch restaurants belonging to that email."
		);
	}
});

app.post("/restaurants", async (req, res) => {
	const restaurant = req.body;
	const savedRestaurant = await addRestaurant(restaurant);

	if (savedRestaurant && savedRestaurant !== "existing restaurant") {
		try {
			await generateTablesForRestaurant(savedRestaurant);

			const allTables = await getTablesByRestaurantId(savedRestaurant._id);
			console.log(
				`Created ${allTables.length} tables for restaurant ${savedRestaurant._id}:`,
				allTables
			);

			res.status(201).send(savedRestaurant);
		} catch (err) {
			console.error("Failed to generate tables:", err);
			res.status(500).end("Failed to create restaurant tables.");
		}
	} else {
		res.status(500).end("existing restaurant");
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

app.patch("/restaurants/update/:id", async (req, res) => {
	try {
		const restaurantId = req.params.id;
		const updateData = req.body;

		const originalRestaurant = await getRestaurantById(restaurantId);
		if (!originalRestaurant) {
			return res.status(404).send("Restaurant not found");
		}

		const updatedRestaurant = await updateRestaurantById(
			restaurantId,
			updateData
		);
		if (!updatedRestaurant) {
			return res.status(404).send("Restaurant not found or update failed.");
		}

		const sizesChanged =
			updateData.tableSizes &&
			JSON.stringify(Object.fromEntries(originalRestaurant.tableSizes)) !==
				JSON.stringify(updateData.tableSizes);

		const durationChanged =
			updateData.bookingDuration &&
			updateData.bookingDuration !== originalRestaurant.bookingDuration;

		const hoursChanged =
			updateData.hours &&
			JSON.stringify(Object.fromEntries(originalRestaurant.hours)) !==
				JSON.stringify(updateData.hours);

		if (sizesChanged || durationChanged || hoursChanged) {
			await removeTables(restaurantId);
			await generateTablesForRestaurant(updatedRestaurant);
			const allTables = await getTablesByRestaurantId(restaurantId);
			console.log(
				`Updated tables for restaurant ${restaurantId}: (${allTables.length} total)`,
				allTables
			);
		}

		res.status(200).json(updatedRestaurant);
	} catch (error) {
		console.error("Error updating restaurant:", error);
		res.status(500).send("Internal Server Error while updating restaurant.");
	}
});


app.delete("/restaurants/:id", async (req, res) => {
	const { id } = req.params;
	const deletedMenus = await removeMenus(id);
	const deletedTables = await removeTables(id);
	await removeReviews(id);
	await removeReservations(id);

	if (!deletedMenus || !deletedTables) {
		res.send(500).end("Failed to remove Restaurant Details.");
	} else {
		const deletedRestaurant = await removeRestaurant(id);
		if (deletedRestaurant) {
			res.status(201).send(deletedRestaurant);
		} else {
			res.status(500).end("Failed to remove Restaurant.");
		}
	}
});

app.post("/menu", authenticateUser, async (req, res) => {
	const menu = req.body;
	const savedMenu = await addMenu(menu);
	if (savedMenu) {
		res.status(201).send(savedMenu);
	} else {
		res.status(500).end();
	}
});

app.get("/menu/:restaurantId", async (req, res) => {
	try {
		const restaurantId = req.params.restaurantId;
		const result = await getMenuByRestaurantId(restaurantId);
		if (result) {
			res.status(200).json(result);
		} else {
			res.status(404).send("Menu(s) not found");
		}
	} catch (error) {
		res.status(500).send("Internal Server Error.");
	}
});

app.get("/table/:restaurantId/:timeSlot/:numPeople", async (req, res) => {
	const { restaurantId, timeSlot, numPeople } = req.params;
	const tables = await getAvailableTablesbyTime(
		restaurantId,
		timeSlot,
		numPeople
	);
	if (tables) {
		res.status(201).send(tables);
	} else {
		res.status(500).end();
	}
});

app.post("/table", async (req, res) => {
	const table = req.body;
	const savedTable = await addTable(table);
	if (savedTable) {
		res.status(201).send(savedTable);
	} else {
		res.status(500).end();
	}
});

app.patch("/table/:tableNum", async (req, res) => {
	const { tableNum } = req.params;
	const updates = req.body;
	let result = null;
	if (updates.isTaken != undefined || updates.isTaken != null) {
		result = await updateTableStatus(
			tableNum,
			updates.timeSlot,
			updates.restaurantId,
			updates.isTaken
		);
	}

	if (result === undefined || result === null) {
		res.status(404).send("Resource not found.");
	} else {
		res.status(201).send(result);
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

app.post("/upload", upload.single("image"), async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).send("No file uploaded.");
		}
		const fileUrl = await uploadToS3(req.file);
		res.status(201).json({ message: "Upload successful", fileUrl });
	} catch (error) {
		console.error("Upload error:", error);
		res.status(500).send("Internal server error during upload.");
	}
});

app.get("/restaurants/pending/owner/:email", async (req, res) => {
	try {
		const restaurantManagerEmail = req.params.email;
		const result = await getPendingRestaurantsByEmail(
			restaurantManagerEmail
		);
		res.status(201).send(result);
	} catch (error) {
		res.status(500).send(
			"Unable to fetch restaurants pending approval belonging to that email."
		);
	}
});

app.get("/restaurants/verified/owner/:email", async (req, res) => {
	try {
		const restaurantManagerEmail = req.params.email;
		const result = await getVerifiedRestaurantsByEmail(
			restaurantManagerEmail
		);
		res.status(201).send(result);
	} catch (error) {
		res.status(500).send(
			"Unable to fetch verified restaurants belonging to that email."
		);
	}
});

app.get("/username/:id", async (req, res) => {
	try {
		const user = await findUserById(req.params.id);
		if (user) {
			res.status(200).json({ username: user.username });
		} else {
			res.status(404).send("User not found");
		}
	} catch (error) {
		res.status(500).send("Internal Server Error");
	}
});
