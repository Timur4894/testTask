import React, { createContext, useState, useContext } from 'react';

const RouteContext = createContext();

export const RouteProvider = ({ children }) => {
    const [distance, setDistanceForRoute] = useState(0);
    const [duration, setDurationForRoute] = useState(0);
    const [origin, setOriginForRoute] = useState(null);
    const [destination, setDestinationForRoute] = useState(null);

    return (
        <RouteContext.Provider value={{ distance, setDistanceForRoute, duration, setDurationForRoute, origin, setOriginForRoute, destination, setDestinationForRoute }}>
            {children}
        </RouteContext.Provider>
    );
};

export const useRoute = () => useContext(RouteContext);
