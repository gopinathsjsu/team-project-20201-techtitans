import mongoose from "mongoose";
import dotenv from "dotenv";
import Gallery from "./gallerySchema.js";

dotenv.config();

let dbConnection;

export function setConnection(newConn) {
  dbConnection = newConn;
  return dbConnection;
}

function getDbConnection() {
  if (!dbConnection) {
    dbConnection = mongoose.createConnection(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
  return dbConnection;
}

export async function addImage(image) {
  const conn = getDbConnection();
  const GalleryModel = conn.model("Gallery", Gallery.schema);
  try {
    const imageToAdd = new GalleryModel(image);
    const savedImage = await imageToAdd.save();
    return savedImage;
  } catch (error) {
    return false;
  }
}

export async function getImagesByRestaurantId(restaurantId) {
  const conn = getDbConnection();
  const GalleryModel = conn.model("Gallery", Gallery.schema);
  try {
    const images = await GalleryModel.find({ restaurantId });
    return images;
  } catch (error) {
    return false;
  }
}