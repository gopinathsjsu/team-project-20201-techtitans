import mongoose from "mongoose";
import dotenv from "dotenv";
import { UserSchema } from "./userSchema.js";

dotenv.config();

let dbConnection;

export function setConnection(newConn) {
	dbConnection = newConn;
	return dbConnection;
}

function getDbConnection() {
	if (!dbConnection) {
		dbConnection = mongoose.createConnection(process.env.MONGODB_URI);
	}
	return dbConnection;
}

export async function findUserByEmail(email) {
	const conn = getDbConnection();
	const userModel = conn.model("User", UserSchema);
	try {
		return await userModel.findOne({ email });
	} catch (error) {
		return undefined;
	}
}

export async function findUserByUsername(username) {
	const conn = getDbConnection();
	const userModel = conn.model("User", UserSchema);
	try {
		return await userModel.findOne({ username });
	} catch (error) {
		return undefined;
	}
}

export async function addUser(user, hashedPwd) {
	const conn = getDbConnection();
	const UserModel = conn.model("User", UserSchema);
	try {
		user.password = hashedPwd;
		const newUser = {
			...user,
			reservations: [],
			restaurantListings: [],
		};
		const userToAdd = new UserModel(newUser);

		let savedUser;
		const checkUserEmail = await findUserByEmail(user.email);
		const checkUsername = await findUserByUsername(user.username);

		if (!checkUserEmail && !checkUsername) {
			savedUser = await userToAdd.save();
		} else {
			return "existing user";
		}
		return savedUser;
	} catch (error) {
		return false;
	}
}

export async function findUserById(id) {
	const conn = getDbConnection();
	const userModel = conn.model("User", UserSchema);
	try {
		return await userModel.findById(id);
	} catch (error) {
		return undefined;
	}
}
