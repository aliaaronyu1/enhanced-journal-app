import { View, Animated, StyleSheet } from "react-native";
import { useEffect, useRef } from "react";

export function TypingDots() {
    const dot1 = useRef(new Animated.Value(0.3)).current;
    const dot2 = useRef(new Animated.Value(0.3)).current;
    const dot3 = useRef(new Animated.Value(0.3)).current;

    const animate = (dot: Animated.Value, delay: number) => {
        return Animated.loop(
            Animated.sequence([
                Animated.delay(delay),
                Animated.timing(dot, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(dot, {
                    toValue: 0.3,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ])
        );
    };

    useEffect(() => {
        Animated.parallel([
            animate(dot1, 0),
            animate(dot2, 150),
            animate(dot3, 300),
        ]).start();
    }, []);

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.dot, { opacity: dot1 }]} />
            <Animated.View style={[styles.dot, { opacity: dot2 }]} />
            <Animated.View style={[styles.dot, { opacity: dot3 }]} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: "#999",
    },
});
