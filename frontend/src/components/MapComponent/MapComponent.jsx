import React from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const MapComponent = ({ latitude, longitude }) => {
    // This is where the issue might be - log the API key to see if it's being loaded correctly

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY ,
    });

    // Add error handling
    if (loadError) {
        console.error("Map load error:", loadError);
        return <div>Error loading Google Maps. Please try again later.</div>;
    }
    
    if (!isLoaded) return <div>Loading Map...</div>;

    return (
        <GoogleMap
            center={{ lat: latitude, lng: longitude }}
            zoom={15}
            mapContainerStyle={{
                width: "100%",
                height: "400px",
                borderRadius: "10px",
            }}
        >
            <Marker position={{ lat: latitude, lng: longitude }} />
        </GoogleMap>
    );
};

export default MapComponent;
