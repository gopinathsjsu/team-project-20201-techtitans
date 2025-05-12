import React from "react";
import "./RestaurantGallery.css";

const RestaurantGallery = ({ images }) => {
    return (
        <div className="gallery">
            {images.map((image, index) => (
                <div key={index} className="gallery-item">
                    <img src={image} alt={`Restaurant Image ${index + 1}`} />
                </div>
            ))}
        </div>
    );
};

export default RestaurantGallery;