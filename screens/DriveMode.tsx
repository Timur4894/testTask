import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Dimensions, Text, TouchableOpacity } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import ChoseWay from "../components/ChoseWay.tsx";
import MapViewDirections from "react-native-maps-directions";

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

type InputAutocompleteProps = {
    label: string;
    placeholder?: string;
    onPlaceSelected: (details: GooglePlaceDetail | null) => void;
};

function InputAutocomplete({
                               label,
                               placeholder,
                               onPlaceSelected,
                           }: InputAutocompleteProps) {
    return (
        <>
            <Text>{label}</Text>
            <GooglePlacesAutocomplete
                styles={{ textInput: styles.input }}
                placeholder={placeholder || ""}
                fetchDetails
                onPress={(data, details = null) => {
                    onPlaceSelected(details);
                }}
                query={{
                    key: 'AIzaSyAbUVQjZBJpvnh0WgKAVLKXfkItH4tV_8c',
                    language: "pt-BR",
                }}
            />
        </>
    );
}

const DriveMode = () => {
    const [origin, setOrigin] = useState<LatLng | null>();
    const [destination, setDestination] = useState<LatLng | null>();
    const [showDirections, setShowDirections] = useState(false);
    const [distance, setDistance] = useState(0);
    const [duration, setDuration] = useState(0);
    const [findWay, setFindWay] = useState(false);
    const [midpoint, setMidpoint] = useState<LatLng | null>(null);
    const mapRef = useRef<MapView>(null);

    const moveTo = async (position: LatLng) => {
        const camera = await mapRef.current?.getCamera();
        if (camera) {
            camera.center = position;
            mapRef.current?.animateCamera(camera, { duration: 1000 });
        }
    };

    const edgePaddingValue = 70;

    const edgePadding = {
        top: edgePaddingValue,
        right: edgePaddingValue,
        bottom: edgePaddingValue,
        left: edgePaddingValue,
    };

    const traceRouteOnReady = (args: any) => {
        if (args) {
            setDistance(args.distance);
            setDuration(args.duration);
            const midLat = (origin.latitude + destination.latitude) / 2;
            const midLng = (origin.longitude + destination.longitude) / 2;
            setMidpoint({ latitude: midLat, longitude: midLng });
        }
    };

    const traceRoute = () => {
        if (origin && destination) {
            setShowDirections(true);
            mapRef.current?.fitToCoordinates([origin, destination], { edgePadding });
        }
    };

    const onPlaceSelected = (
        details: GooglePlaceDetail | null,
        flag: "origin" | "destination"
    ) => {
        const set = flag === "origin" ? setOrigin : setDestination;
        const position = {
            latitude: details?.geometry.location.lat || 0,
            longitude: details?.geometry.location.lng || 0,
        };
        set(position);
        moveTo(position);
    };

    // Функция для преобразования времени в пути из минут в формат "часы минуты"
    const formatDuration = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        if (hours === 0) {
            return `${remainingMinutes} мин`;
        } else {
            return `${hours} час ${remainingMinutes} мин`;
        }
    };

    const whiteMapStyle = [
        {
            featureType: 'landscape',
            elementType: 'geometry',
            stylers: [
                {
                    color: '#ffffff', // белый цвет для земли
                },
            ],
        },
        {
            featureType: 'administrative.country',
            elementType: 'geometry.stroke',
            stylers: [
                {
                    color: '#000000', // черный цвет для границ стран
                },
            ],
        },
        {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [
                {
                    color: '#ffffff', // белый цвет для дорог
                },
            ],
        },
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
                {origin && <Marker coordinate={origin} />}
                {destination && <Marker coordinate={destination} />}
                {showDirections && origin && destination && (
                    <>
                        <MapViewDirections
                            origin={origin}
                            destination={destination}
                            apikey='AIzaSyAbUVQjZBJpvnh0WgKAVLKXfkItH4tV_8c'
                            strokeColor="#6644ff"
                            strokeWidth={4}
                            onReady={traceRouteOnReady}
                        />
                        {midpoint && (
                            <Marker coordinate={midpoint}>
                                <View style={styles.durationContainer}>
                                    <Text style={styles.durationText}>{formatDuration(Math.ceil(duration))}</Text>
                                    <Text style={styles.durationText}>{distance.toFixed(2)} meters</Text>
                                </View>
                            </Marker>
                        )}
                    </>
                )}
            </MapView>

            {findWay && <View style={styles.searchContainer}>
                <InputAutocomplete
                    label="Origin"
                    onPlaceSelected={(details) => {
                        onPlaceSelected(details, "origin");
                    }}
                />
                <InputAutocomplete
                    label="Destination"
                    onPlaceSelected={(details) => {
                        onPlaceSelected(details, "destination");
                    }}
                />
                <TouchableOpacity style={styles.button} onPress={traceRoute}>
                    <Text style={styles.buttonText}>Trace route</Text>
                </TouchableOpacity>
                {distance && duration ? (
                    <View>
                        <Text>Distance: {distance.toFixed(2)} km</Text>
                        <Text>Duration: {Math.ceil(duration)} min</Text>
                    </View>
                ) : null}
            </View>}
            <ChoseWay onPress={() => setFindWay(true)} />
        </View>
    );
}

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
