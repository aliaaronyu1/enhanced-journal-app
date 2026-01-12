import { useLocalSearchParams, useRouter } from "expo-router";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { API_URL } from "@/lib/api";
// import { Keyboard } from "react-native";
import { v4 as uuid } from "uuid";
import TypingIndicator from "@/components/TypingIndicator"
type Message = {
    id: string;
    role: "user" | "assistant";
    content: string;
};

export default function AiChat() {
    const { entryId } = useLocalSearchParams<{ entryId: string }>();
    const router = useRouter();

    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [pageLoading, setPageLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const { user } = useContext(AuthContext)
    // const [keyboardVisible, setKeyboardVisible] = useState(false);

    const listRef = useRef<FlatList>(null);

    // useEffect(() => {
    //     const show = Keyboard.addListener("keyboardDidShow", () =>
    //         setKeyboardVisible(true)
    //     );
    //     const hide = Keyboard.addListener("keyboardDidHide", () =>
    //         setKeyboardVisible(false)
    //     );

    //     return () => {
    //         show.remove();
    //         hide.remove();
    //     };
    // }, []);

    //Load existing conversation
    useEffect(() => {
        if (!entryId) return;

        const loadMessages = async () => {
            try {
                const res = await fetch(
                    `${API_URL}/user/${user.id}/ai-conversations/${entryId}`
                );
                const data = await res.json();
                setMessages(data.messages);
            } catch (err) {
                console.error("Failed to load messages", err);
            } finally {
                setPageLoading(false)
            }
        };

        loadMessages();
    }, [entryId]);

    //Auto-scroll on new message
    useEffect(() => {
        listRef.current?.scrollToEnd({ animated: true });
    }, [messages]);

    //Send message
    const sendMessage = async () => {
        if (!input.trim() || loading) return;

        const optimisticMsg: Message = {
            id: uuid(),
            role: "user",
            content: input.trim(),
        };

        setMessages(prev => [...prev, optimisticMsg]);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch(
                `${API_URL}/user/${user.id}/ai-conversations/${entryId}/message`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ content: optimisticMsg.content }),
                }
            );

            const aiMessage: Message = await res.json();

            setMessages(prev => [...prev, aiMessage]);
        } catch (err) {
            console.error("Chat error", err);
        } finally {
            setLoading(false);
        }
    };
    if (pageLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        )
    }
    return (
        <SafeAreaView style={styles.safe}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.back}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>AI Chat</Text>
            </View>

            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                keyboardVerticalOffset={90}
            >
                {/* Messages */}
                <FlatList
                    ref={listRef}
                    data={messages}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.list}
                    renderItem={({ item }) => (
                        <View
                            style={[
                                styles.message,
                                item.role === "user"
                                    ? styles.userMessage
                                    : styles.aiMessage,
                            ]}
                        >
                            <Text style={styles.messageText}>{item.content}</Text>
                        </View>
                    )}
                    ListFooterComponent={loading ? <TypingIndicator /> : null}
                />
                    {/* Input */}
                    <View style={styles.inputRow}>
                        <TextInput
                            value={input}
                            onChangeText={setInput}
                            placeholder="Ask something…"
                            multiline
                            style={styles.input}
                        />
                        <TouchableOpacity onPress={sendMessage} disabled={loading}>
                            <Text style={styles.send}>{loading ? "…" : "Send"}</Text>
                        </TouchableOpacity>
                    </View>

            </KeyboardAvoidingView>
        </SafeAreaView>

    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: "#fff" },
    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        borderBottomWidth: 1,
        borderColor: "#eee",
    },
    back: { color: "#007AFF", fontSize: 16 },
    title: { fontSize: 16, fontWeight: "600", marginLeft: 12 },
    container: {
        flex: 1
    },
    list: { padding: 12 },
    message: {
        padding: 10,
        borderRadius: 12,
        marginBottom: 8,
        maxWidth: "80%",
    },
    userMessage: {
        alignSelf: "flex-end",
        backgroundColor: "#DCF8C6",
    },
    aiMessage: {
        alignSelf: "flex-start",
        backgroundColor: "#F1F1F1",
    },
    messageText: { fontSize: 15 },
    inputRow: {
        flexDirection: "row",
        padding: 8,
        borderTopWidth: 1,
        borderColor: "#eee",
        alignItems: "flex-end",
    },
    input: {
        flex: 1,
        minHeight: 40,
        maxHeight: 120,
        padding: 10,
        borderRadius: 16,
        backgroundColor: "#f5f5f5",
    },
    send: {
        marginLeft: 8,
        color: "#007AFF",
        fontSize: 16,
        padding: 8,
    },
});