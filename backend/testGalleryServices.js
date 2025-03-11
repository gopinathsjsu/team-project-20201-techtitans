import mongoose from "mongoose";
import dotenv from "dotenv";
import { addImage, getImagesByRestaurantId, setConnection } from "./models/galleryServices.js";

dotenv.config();

async function runTests() {
  // Set up a new database connection for testing
  const testDbUri = process.env.MONGODB_URI_TEST || "mongodb://localhost:27017/test";
  const testConnection = mongoose.createConnection(testDbUri);
  setConnection(testConnection);

  // Test data
  const testRestaurantId = new mongoose.Types.ObjectId();
  const testImage = {
    restaurantId: testRestaurantId,
    imageUrl: "http://example.com/image.jpg",
    description: "Test image description",
  };

  // Test addImage function
  const addedImage = await addImage(testImage);
  if (addedImage) {
    console.log("addImage test passed:", addedImage);
  } else {
    console.error("addImage test failed");
  }

  // Test getImagesByRestaurantId function
  const images = await getImagesByRestaurantId(testRestaurantId);
  if (images && images.length > 0) {
    console.log("getImagesByRestaurantId test passed:", images);
  } else {
    console.error("getImagesByRestaurantId test failed");
  }

  // Close the test database connection
  testConnection.close();
}

runTests().catch((error) => {
  console.error("Test script encountered an error:", error);
});