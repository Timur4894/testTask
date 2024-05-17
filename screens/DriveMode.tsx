import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Polyline, Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const DriveMode = () => {
    const [initialRegion, setInitialRegion] = useState({
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });
    const [destination, setDestination] = useState(null);
    const [polylineCoordinates, setPolylineCoordinates] = useState([]);

    useEffect(() => {
        Geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                setInitialRegion({
                    latitude,
                    longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                });
            },
            error => alert(error.message),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
    }, []);

    useEffect(() => {
        if (initialRegion && destination) {
            fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${initialRegion.latitude},${initialRegion.longitude}&destination=${destination.latitude},${destination.longitude}&key=YOUR_GOOGLE_MAPS_API_KEY`)
                .then(response => response.json())
                .then(responseJson => {
                    const { routes } = responseJson;
                    if (routes.length) {
                        const points = routes[0].overview_polyline.points;
                        const decodedPoints = decodePolyline(points);
                        setPolylineCoordinates(decodedPoints);
                    }
                })
                .catch(error => console.error('Error fetching directions:', error));
        }
    }, [initialRegion, destination]);

    const decodePolyline = encoded => {
        const poly = [];
        let index = 0, lat = 0, lng = 0;

        while (index < encoded.length) {
            let b, shift = 0, result = 0;
            do {
                b = encoded.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);
            const dlat = (result & 1) !== 0 ? ~(result >> 1) : (result >> 1);
            lat += dlat;
            shift = 0;
            result = 0;
            do {
                b = encoded.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);
            const dlng = (result & 1) !== 0 ? ~(result >> 1) : (result >> 1);
            lng += dlng;
            poly.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
        }
        return poly;
    };

    return (
        <View style={styles.container}>
            <GooglePlacesAutocomplete
                placeholder="Search"
                onPress={(data, details = null) => {
                    const { lat, lng } = details.geometry.location;
                    setDestination({
                        latitude: lat,
                        longitude: lng,
                    });
                }}
                query={{
                    key: 'YOUR_GOOGLE_MAPS_API_KEY',
                    language: 'en',
                }}
                fetchDetails={true}
                styles={{
                    container: {
                        flex: 0,
                        position: 'absolute',
                        width: '100%',
                        zIndex: 1,
                    },
                    listView: { backgroundColor: 'white' },
                }}
            />
            <MapView
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                region={initialRegion}
            >
                <Marker
                    coordinate={initialRegion}
                    title="Start Point"
                    description="This is the starting point"
                />
                {destination && (
                    <Marker
                        coordinate={destination}
                        title="End Point"
                        description="This is the destination point"
                    />
                )}
                {polylineCoordinates.length > 0 && (
                    <Polyline
                        coordinates={polylineCoordinates}
                        strokeWidth={5}
                        strokeColor="#FF0000"
                    />
                )}
            </MapView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});

export default DriveMode;
