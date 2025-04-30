import React from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const MapComponent = ({ latitude, longitude }) => {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    });

    if (!isLoaded) return <div>Loading Map...</div>;

    return (
        <GoogleMap
            center={{ lat: latitude, lng: longitude }}
            zoom={15}
            mapContainerStyle={{ width: "100%", height: "400px", borderRadius: "10px" }}
        >
            <Marker position={{ lat: latitude, lng: longitude }} />
        </GoogleMap>
    );
};

export default MapComponent;