import { View, Text, StyleSheet } from "react-native";
import { TypingDots } from "./TypingDots";

export default function TypingIndicator() {
    return (
        <View style={[styles.message, styles.aiMessage]}>
            <TypingDots />
        </View>
    );
}

const styles = StyleSheet.create({
    typingBubble: {
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    message: {
        padding: 10,
        borderRadius: 12,
        marginBottom: 8,
        maxWidth: "80%",
    },
    aiMessage: {
        alignSelf: "flex-start",
        backgroundColor: "#F1F1F1",
    },
})