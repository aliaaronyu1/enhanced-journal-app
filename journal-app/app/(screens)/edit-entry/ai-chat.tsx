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
  Surface,
} from "react-native-paper";
import { useAppTheme } from "@/constants/theme";
type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export default function AiChat() {
  const { entryId } = useLocalSearchParams<{ entryId: string }>();
  const router = useRouter();
  const theme = useAppTheme();
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
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { 
        borderColor: theme.colors.surfaceDisabled,
        backgroundColor: theme.colors.surface
      }]}>
        <IconButton
          icon="arrow-left"
          size={20}
          onPress={() => router.back()}
          iconColor={theme.colors.primary}
        />
        <Text style={[styles.headerTitle, { color: theme.colors.primary }]}>Reflection Assistant</Text>
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
                  ? [styles.userMessage, { backgroundColor: theme.colors.chatUserBubble }]
                  : [styles.aiMessage, {
                    backgroundColor: theme.colors.chatAiBubble,
                    borderColor: theme.colors.surfaceDisabled
                  }],
              ]}
              elevation={item.role === "assistant" ? 1 : 0}
            >
              <Text style={[styles.messageText, { color: theme.colors.chatText }]}>{item.content}</Text>
            </Surface>
          )}
          ListFooterComponent={loading ? <TypingIndicator /> : null}
        />

        {/* Input */}
        <View style={[styles.inputRow, {
          borderColor: theme.colors.surfaceDisabled,
          backgroundColor: theme.colors.surface
        }]}>
          <TextInput
            mode="flat"
            value={input}
            onChangeText={setInput}
            placeholder="Ask or reflect…"
            placeholderTextColor={theme.colors.onSurfaceVariant}
            multiline
            style={styles.input}
          />
          <IconButton
            icon="send"
            onPress={sendMessage}
            disabled={loading}
            iconColor={theme.colors.primary}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
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
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: "500",
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
  },

  aiMessage: {
    alignSelf: "flex-start",
    borderWidth: 1,
  },

  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
  },

  input: {
    flex: 1,
    backgroundColor: "transparent",
    fontSize: 15,
    maxHeight: 120,
  },
});
