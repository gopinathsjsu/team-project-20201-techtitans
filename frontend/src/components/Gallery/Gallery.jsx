import { useState } from "react";
import "./Gallery.css";

const sampleImages = [
	"/images/restaurant1.jpg",
	"/images/restaurant2.jpg",
	"/images/restaurant3.jpg",
	"/images/restaurant4.jpg",
];

const Gallery = ({ images = sampleImages }) => {
	const [selectedImageIndex, setSelectedImageIndex] = useState(null);

	const handleImageClick = (index) => {
		setSelectedImageIndex(index);
	};

	const handleModalClick = () => {
		setSelectedImageIndex(null);
	};

	return (
		<div className="gallery-container">
			<h2>Gallery</h2>
			<div className="gallery-grid">
				{images.map((img, index) => (
					<img
						key={index}
						src={img}
						alt={`Gallery ${index}`}
						onClick={() => handleImageClick(index)}
					/>
				))}
			</div>
			{selectedImageIndex !== null && (
				<div className="modal" onClick={handleModalClick}>
					<div className="modal-content">
						<div className="scroll-container">
							{images.map((img, index) => (
								<img
									key={index}
									src={img}
									alt={`Gallery ${index}`}
									className="scroll-image"
								/>
							))}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Gallery;
