import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import "./Reviews.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


const sampleReviews = [
  { user: "Alice", rating: 5, comment: "Amazing food and great service!" },
  { user: "Bob", rating: 4, comment: "Good experience, but a bit expensive." },
  { user: "Charlie", rating: 3, comment: "Food was okay, service could be better." },
];

const Reviews = ({ reviews = sampleReviews }) => {
  const averageRating = reviews.length ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : "No reviews yet";

  const ratingCounts = [0, 0, 0, 0, 0];
  reviews.forEach(review => {
    ratingCounts[review.rating - 1]++;
  });

  const data = {
    labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
    datasets: [
      {
        label: 'Number of Reviews',
        data: ratingCounts,
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: 'y', // This makes the chart horizontal
    responsive: true,
    plugins: {
      legend: {
        display: false, // Hide the legend
      },
      title: {
        display: true,
        text: 'Rating Distribution',
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="reviews-container">
      <h2>Reviews</h2>
      <div className="rating-chart-container">
        <p className="average-rating">Average Rating: {averageRating} ⭐</p>
        <div className="chart-container">
          <Bar data={data} options={options} />
        </div>
      </div>
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