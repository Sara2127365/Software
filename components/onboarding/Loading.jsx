import { View, Text, StyleSheet, Animated } from 'react-native';
import React, { useEffect } from 'react'
import { useRef } from 'react';

export default function Loading() {
    const rotateAnim = useRef(new Animated.Value(3)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            })
        ).start();
    }, []);

    const rotate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.loader, { transform: [{ rotate }] }]}>
                <View style={styles.innerCircle} />
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
        height: '100vh'
    },
    loader: {
        width: 48,
        height: 48,
        borderRadius: 24,
        borderTopWidth: 3,
        borderRightWidth: 2,
        borderBottomWidth: 3,
        borderLeftWidth: 2,
        borderTopColor: '#de3500',
        borderRightColor: 'rgba(255, 255, 255, 0.3)',
        borderBottomColor: '#fff',
        borderLeftColor: 'rgba(151, 107, 93, 0.3)',
        position: 'absolute',
    },
    innerCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
    },
    text: {
        fontSize: 25,
        color: '#333',
        fontWeight: 'bold',
    },
});
