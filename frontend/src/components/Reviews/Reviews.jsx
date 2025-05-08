import "./Reviews.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Reviews = () => {
	const { id } = useParams();
	const [reviews, setReviews] = useState([]);
	const [displayCount, setDisplayCount] = useState(3); // Start by showing 3 reviews

	useEffect(() => {
		const fetchReviews = async () => {
			try {
				const res = await axios.get(
					`http://localhost:5000/restaurants/${id}`
				);
				setReviews(res.data.reviews || []);
			} catch (err) {
				console.error("Failed to fetch reviews", err);
				setReviews([]);
			}
		};

		if (id) fetchReviews();
	}, [id]);

	const handleLoadMore = () => {
		// Increase display count by 3, but don't exceed total reviews length
		setDisplayCount((prev) => Math.min(prev + 3, reviews.length));
	};

	const averageRating = reviews.length
		? (
				reviews.reduce((acc, r) => acc + Number(r.rating || 0), 0) /
				reviews.length
			).toFixed(1)
		: "No reviews yet";

	// loads first three reviews, click to load more
	return (
		<div className="reviews-container">
			<h2>Reviews</h2>
			<p className="average-rating">Average Rating: {averageRating} ⭐</p>
			<div className="reviews-list">
				{reviews.length > 0 ? (
					<>
						{reviews.slice(0, displayCount).map((review) => (
							<div key={review._id} className="review-card">
								<p>
									<strong>{review.user}</strong>
								</p>
								<p>{"⭐".repeat(Number(review.rating) || 0)}</p>
								<p>{review.comment}</p>
								<p>
									<em>
										{new Date(
											review.date
										).toLocaleDateString()}
									</em>
								</p>
							</div>
						))}

						{displayCount < reviews.length && (
							<button
								onClick={handleLoadMore}
								className="load-more-btn"
							>
								Load More
							</button>
						)}
					</>
				) : (
					<p>No reviews yet.</p>
				)}
			</div>
		</div>
	);
};

export default Reviews;
