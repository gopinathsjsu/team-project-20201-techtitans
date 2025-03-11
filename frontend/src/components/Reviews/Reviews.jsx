import React from "react";
import "./Reviews.css";

const sampleReviews = [
  { user: "Alice", rating: 5, comment: "Amazing food and great service!" },
  { user: "Bob", rating: 4, comment: "Good experience, but a bit expensive." },
  { user: "Charlie", rating: 3, comment: "Food was okay, service could be better." },
];

const Reviews = ({ reviews = sampleReviews }) => {
  const averageRating = reviews.length ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : "No reviews yet";

  return (
    <div className="reviews-container">
      <h2>Reviews</h2>
      <p>Average Rating: {averageRating} ⭐</p>
      <div className="reviews-list">
        {reviews.map((review, index) => (
          <div key={index} className="review-card">
            <p><strong>{review.user}</strong></p>
            <p>{"⭐".repeat(review.rating)}</p>
            <p>{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;