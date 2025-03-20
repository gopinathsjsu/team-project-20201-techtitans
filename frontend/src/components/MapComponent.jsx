import { GoogleMap, LoadScript } from "@react-google-maps/api";

const MapComponent = () => {
	const mapStyles = {
		height: "400px",
		width: "800px",
	};

	// San Jose coordinates
	const defaultCenter = {
		lat: 37.33548,
		lng: -121.893028,
	};

	return (
		<LoadScript googleMapsApiKey="AIzaSyBeMgCkD6SV6CVSuxtbeFhW94ThNXj9-yU">
			<GoogleMap
				mapContainerStyle={mapStyles}
				zoom={10}
				center={defaultCenter}
			/>
		</LoadScript>
	);
};

export default MapComponent;
