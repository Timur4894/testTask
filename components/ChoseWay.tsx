import React from 'react';
import {StyleSheet, Text, Pressable} from 'react-native';

const ChoseWay = ({onPress} : any) => {
    return (
        <Pressable style={styles.button} onPress={onPress}>
            <Text style={styles.text}>Обрати маршрут</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        position: 'absolute',
        bottom: 23,
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 34,
        elevation: 3,
        backgroundColor: '#1D1D4A',
    },
    text: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        color: '#665CD1',
    },
});

export default ChoseWay;
