import React from "react";
import Gallery from "../Gallery/Gallery";
import Reviews from "../Reviews/Reviews";
import "./RestaurantPage.css";

const RestaurantPage = () => {
  return (
    <div className="restaurant-page">
      <h1>Restaurant Name</h1>
      <Gallery />
      <Reviews />
    </div>
  );
};

export default RestaurantPage;