import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Dimensions, Text, TouchableOpacity } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Circle } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import ChoseWay from "../components/ChoseWay.tsx";
import MapViewDirections from "react-native-maps-directions";
import { useRoute } from '../utils/RouteContext';

const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.02;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const INITIAL_POSITION = {
    latitude: 40.76711,
    longitude: -73.979704,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
};

type LatLng = {
    latitude: number;
    longitude: number;
};

type InputAutocompleteProps = {
    label: string;
    placeholder?: string;
    onPlaceSelected: (details: GooglePlaceDetail | null) => void;
};

function InputAutocomplete({ label, placeholder, onPlaceSelected }: InputAutocompleteProps) {
    return (
        <>
            <Text>{label}</Text>
            <GooglePlacesAutocomplete
                styles={{ textInput: styles.input }}
                placeholder={placeholder || ""}
                fetchDetails
                onPress={(data, details = null) => onPlaceSelected(details)}
                query={{
                    key: 'YOUR_KEY',
                    language: "pt-BR",
                }}
            />
        </>
    );
}

const DriveMode = () => {
    const { setDistanceForRoute, setDurationForRoute, setOriginForRoute, setDestinationForRoute } = useRoute();
    const [origin, setOrigin] = useState<LatLng | null>(null);
    const [destination, setDestination] = useState<LatLng | null>(null);
    const [showDirections, setShowDirections] = useState(false);
    const [distance, setDistance] = useState(0);
    const [duration, setDuration] = useState(0);
    const [findWay, setFindWay] = useState(false);
    const [midpoint, setMidpoint] = useState<LatLng | null>(null);
    const mapRef = useRef<MapView>(null);
    const edgePaddingValue = 70;

    const moveTo = async (position: LatLng) => {
        const camera = await mapRef.current?.getCamera();
        if (camera) {
            camera.center = position;
            mapRef.current?.animateCamera(camera, { duration: 1000 });
        }
    };

    const edgePadding = {
        top: edgePaddingValue,
        right: edgePaddingValue,
        bottom: edgePaddingValue,
        left: edgePaddingValue,
    };

    const traceRouteOnReady = (args: any, isAlternative = false) => {
        if (args) {
            if (!isAlternative) {
                setDistance(args.distance);
                setDuration(args.duration);
                setDistanceForRoute(args.distance);
                setDurationForRoute(args.duration);

                if (origin && destination) {
                    const midLat = (origin.latitude + destination.latitude) / 2;
                    const midLng = (origin.longitude + destination.longitude) / 2;
                    setMidpoint({ latitude: midLat, longitude: midLng });
                }
            }
        }
    };

    const traceRoute = () => {
        if (origin && destination) {
            setShowDirections(true);
            setFindWay(false);
            mapRef.current?.fitToCoordinates([origin, destination], { edgePadding });
        }
    };

    const onPlaceSelected = (details: GooglePlaceDetail | null, flag: "origin" | "destination") => {
        const set = flag === "origin" ? setOrigin : setDestination;
        const position = {
            latitude: details?.geometry.location.lat || 0,
            longitude: details?.geometry.location.lng || 0,
        };
        set(position);
        moveTo(position);
    };

    const formatDuration = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return hours === 0 ? `${remainingMinutes} мин` : `${hours} час ${remainingMinutes} мин`;
    };

    const whiteMapStyle = [
        { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
        { featureType: 'administrative.country', elementType: 'geometry.stroke', stylers: [{ color: '#000000' }] },
        { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
    ];

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                initialRegion={INITIAL_POSITION}
                customMapStyle={whiteMapStyle}
            >
                {origin && (
                    <Circle
                        center={origin}
                        radius={20000}
                        fillColor="#fff"
                        strokeColor="#6644ff"
                        strokeWidth={5}
                    />
                )}
                {destination && (
                    <Circle
                        center={destination}
                        radius={20000}
                        fillColor="#fff"
                        strokeColor="#6644ff"
                        strokeWidth={5}
                    />
                )}
                {showDirections && origin && destination && (
                    <>
                        <MapViewDirections
                            origin={origin}
                            destination={destination}
                            apikey='YOUR_KEY'
                            strokeColor="#8987A1"
                            strokeWidth={4}
                            onReady={(args) => traceRouteOnReady(args, false)}
                        />
                        <MapViewDirections
                            origin={origin}
                            destination={destination}
                            apikey='YOUR_KEY'
                            strokeColor="#6644ff"
                            strokeWidth={5}
                            waypoints={[
                                {
                                    latitude: (origin.latitude + destination.latitude) / 2 + 0.01,
                                    longitude: (origin.longitude + destination.longitude) / 2 + 0.01,
                                },
                            ]}
                            onReady={(args) => traceRouteOnReady(args, true)}
                        />
                        {midpoint && (
                            <Marker coordinate={midpoint}>
                                <View style={styles.durationContainer}>
                                    <Text style={styles.durationText}>{formatDuration(Math.ceil(duration))}</Text>
                                    <Text style={styles.durationText}>{distance.toFixed(2)} km</Text>
                                </View>
                            </Marker>
                        )}
                    </>
                )}
            </MapView>

            {findWay && (
                <View style={styles.searchContainer}>
                    <InputAutocomplete
                        label="Origin"
                        onPlaceSelected={(details) => {
                            onPlaceSelected(details, "origin");
                            setOriginForRoute(details.address_components[0].long_name);
                        }}
                    />
                    <InputAutocomplete
                        label="Destination"
                        onPlaceSelected={(details) => {
                            onPlaceSelected(details, "destination");
                            setDestinationForRoute(details.address_components[0].long_name);
                        }}
                    />
                    <TouchableOpacity style={styles.button} onPress={traceRoute}>
                        <Text style={styles.buttonText}>Trace route</Text>
                    </TouchableOpacity>
                    {distance && duration ? (
                        <View>
                            <Text>Distance: {distance.toFixed(2)} km</Text>
                            <Text>Duration: {formatDuration(Math.ceil(duration))}</Text>
                        </View>
                    ) : null}
                </View>
            )}
            <ChoseWay onPress={() => setFindWay(true)} />
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
    searchContainer: {
        position: "absolute",
        width: "90%",
        backgroundColor: "white",
        shadowColor: "black",
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 4,
        padding: 8,
        borderRadius: 8,
        top: 111,
    },
    input: {
        borderColor: "#888",
        borderWidth: 1,
    },
    button: {
        backgroundColor: "#bbb",
        paddingVertical: 12,
        marginTop: 16,
        borderRadius: 4,
    },
    buttonText: {
        textAlign: "center",
    },
    durationContainer: {
        backgroundColor: '#000',
        padding: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    durationText: {
        fontSize: 14,
        color: '#fff',
    },
});

export default DriveMode;
