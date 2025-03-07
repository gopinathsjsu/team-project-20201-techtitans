import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import { addRestaurant } from "./models/restaurantServices.js";
import { addUser, findUserByUsername } from "./models/userServices.js";

const app = express();
const PORT = 5173;

app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
	console.log(`Server started at http://localhost:${PORT}`);
});

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
