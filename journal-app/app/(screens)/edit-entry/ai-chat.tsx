import { useLocalSearchParams, useRouter } from "expo-router";
import {
  View,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { API_URL } from "@/lib/api";
import { v4 as uuid } from "uuid";
import TypingIndicator from "@/components/TypingIndicator";

import {
  Text,
  TextInput,
  IconButton,
  ActivityIndicator,
  useTheme,
  Surface,
} from "react-native-paper";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export default function AiChat() {
  const { entryId } = useLocalSearchParams<{ entryId: string }>();
  const router = useRouter();
  const theme = useTheme();
  const { user } = useContext(AuthContext);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  const listRef = useRef<FlatList>(null);

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
        setPageLoading(false);
      }
    };

    loadMessages();
  }, [entryId]);

  useEffect(() => {
    listRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

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
      <View style={styles.loader}>
        <ActivityIndicator animating size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={20}
          onPress={() => router.back()}
          iconColor="#334155"
        />
        <Text style={styles.headerTitle}>Reflection Assistant</Text>
      </View>

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Messages */}
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Surface
              style={[
                styles.message,
                item.role === "user"
                  ? styles.userMessage
                  : styles.aiMessage,
              ]}
              elevation={item.role === "assistant" ? 1 : 0}
            >
              <Text style={styles.messageText}>{item.content}</Text>
            </Surface>
          )}
          ListFooterComponent={loading ? <TypingIndicator /> : null}
        />

        {/* Input */}
        <View style={styles.inputRow}>
          <TextInput
            mode="flat"
            value={input}
            onChangeText={setInput}
            placeholder="Ask or reflect…"
            multiline
            style={styles.input}
          />
          <IconButton
            icon="send"
            onPress={sendMessage}
            disabled={loading}
            iconColor="#334155"
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderColor: "rgba(226,232,240,0.6)",
    backgroundColor: "rgba(255,255,255,0.8)",
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#334155",
  },

  container: {
    flex: 1,
  },

  list: {
    padding: 16,
    gap: 8,
  },

  message: {
    padding: 12,
    borderRadius: 16,
    maxWidth: "82%",
  },

  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#e2e8f0",
  },

  aiMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "rgba(226,232,240,0.8)",
  },

  messageText: {
    fontSize: 15,
    color: "#0f172a",
    lineHeight: 22,
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: "rgba(226,232,240,0.6)",
    backgroundColor: "#ffffff",
  },

  input: {
    flex: 1,
    backgroundColor: "transparent",
    fontSize: 15,
    maxHeight: 120,
  },
});
