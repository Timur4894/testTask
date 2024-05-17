import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import ChoseWay from "../components/ChoseWay";

const DriveMode = () => {

    return (
        <View style={styles.container}>
            <MapView style={styles.map} />
            {/*provider={PROVIDER_GOOGLE}*/}
            <ChoseWay/>
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
});

export default DriveMode;
