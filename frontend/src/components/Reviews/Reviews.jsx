import "./Reviews.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Reviews = () => {
	const { id } = useParams();
	const [reviews, setReviews] = useState([]);
	const [displayCount, setDisplayCount] = useState(3); // Start by showing 3 reviews
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchReviews = async () => {
			setIsLoading(true);
			setError(null);
			try {
				const res = await axios.get(
					`http://restaurant-api-alb-405497354.us-east-2.elb.amazonaws.com:5000/restaurants/${id}/reviews`
				);
				setReviews(res.data.reviews || []);
			} catch (err) {
				setError("Failed to load reviews. Please try again.");
				setReviews([]);
			} finally {
				setIsLoading(false);
			}
		};

		if (id) fetchReviews();
	}, [id]);

	const handleLoadMore = () => {
		setDisplayCount((prev) => Math.min(prev + 3, reviews.length));
	};

	const averageRating = reviews.length
		? (
				reviews.reduce((acc, r) => acc + Number(r.rating || 0), 0) /
				reviews.length
			).toFixed(1)
		: "No reviews yet";

	return (
		<div className="reviews-container">
			<h2>Reviews</h2>
			<p className="average-rating">Average Rating: {averageRating} ⭐</p>

			{isLoading && <p>Loading reviews...</p>}
			{error && <p className="error-message">{error}</p>}

			<div className="reviews-list">
				{!isLoading && reviews.length > 0 ? (
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
								disabled={isLoading}
							>
								Load More
							</button>
						)}
					</>
				) : (
					!isLoading && <p>No reviews yet.</p>
				)}
			</div>
		</div>
	);
};

export default Reviews;
