import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect, useContext, useRef } from "react";
import { View, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, StyleSheet, Keyboard, Modal } from "react-native";
import axios from "axios";
import { AuthContext } from "@/context/AuthContext";
import { API_URL } from "@/lib/api";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { MotiView } from "moti";
import {
  Text,
  TextInput,
  ActivityIndicator,
  useTheme,
  IconButton,
  FAB
} from "react-native-paper";

export default function EditEntryScreen() {
  const { user } = useContext(AuthContext);
  const { entryId } = useLocalSearchParams();
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const [hasConversation, setHasConversation] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const savingRequestRef = useRef<Promise<void> | null>(null);
  const theme = useTheme();
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });

    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  useEffect(() => {
    fetchEntry();
  }, []);

  const fetchEntry = async () => {
    try {
      const res = await axios.get(`${API_URL}/user/${user.id}/journal-entry/${entryId}`);
      setTitle(res.data.title);
      setBody(res.data.body);
    } catch (error) {
      console.error("Could not load entry", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!entryId) return;

    const loadMessages = async () => {
      try {
        const res = await fetch(
          `${API_URL}/user/${user.id}/ai-conversations/${entryId}`
        );
        const data = await res.json();
        setHasConversation(data.messages.length !== 0)
      } catch (err) {
        console.error("Failed to load messages", err);
      }
    };

    loadMessages();
  }, [entryId]);

  const autoSave = (newTitle: string, newBody: string) => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(async () => {
      setSaving(true);
      const save = async () => {
        try {
          if (!newTitle.trim() && !newBody.trim()) {
            await handleDelete()
          }
          else {
            await axios.put(`${API_URL}/user/${user.id}/journal-entry/${entryId}`, { title: newTitle, body: newBody });
          }
        } catch (err) {
          console.error("Auto-save failed", err);
        } finally {
          setSaving(false);
        }
      };

      if (savingRequestRef.current) await savingRequestRef.current.catch(() => { });
      savingRequestRef.current = save();
      await savingRequestRef.current;
      savingRequestRef.current = null;
    }, 1000);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/user/${user.id}/journal-entry/${entryId}`);
    } catch (error) {
      console.error("Failed to delete draft", error);
    }
  };

  const handleBack = async () => {
    if (!title.trim() && !body.trim()) await handleDelete();
    router.back();
  };

  const handleResubmit = async () => {
    try {
      setSubmitting(true);
      await fetch(`${API_URL}/user/${user.id}/ai-conversations/${entryId}/submit-entry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entryBody: body }),
      });
      setSubmitting(false);
      router.push({ pathname: "/(screens)/edit-entry/ai-chat", params: { entryId } });
    } catch (err) {
      console.error("Failed to resubmit entry", err);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator animating size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <MotiView
      from={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        scale: 0.8,
      }}
      transition={{
        type: 'timing',
        duration: 400,
      }}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive">
          <SafeAreaView edges={["top"]} style={{ flex: 1, padding: 16 }}>
            {/* Header */}
            <View style={styles.header}>
              <IconButton
                icon="arrow-left"
                size={20}
                onPress={handleBack}
                iconColor="#334155"
              />

              <TouchableOpacity onPress={() => setMenuVisible(true)}>
                <MaterialIcons name="more-vert" size={28} color="#374151" />
              </TouchableOpacity>
            </View>

            {/* Title Input */}
            <TextInput
              mode="flat"
              label="Title"
              value={title}
              placeholder="Title..."
              placeholderTextColor="#999"
              onChangeText={(text) => {
                setTitle(text);
                autoSave(text, body);
              }}
              style={{ marginBottom: 16, backgroundColor: "transparent", fontWeight: "bold", fontSize: 20 }}
            />

            {/* Body Input */}
            <TextInput
              mode="flat"
              value={body}
              placeholder="Write your thoughts..."
              placeholderTextColor="#999"
              onChangeText={(text) => {
                setBody(text);
                autoSave(title, text);
              }}
              multiline
              autoCorrect={true}
              spellCheck={true}
              scrollEnabled={false}
              style={{
                minHeight: 200,
                flex: 1,
                backgroundColor: "transparent",
                fontSize: 16,
                marginBottom: 16,
              }}
            />
          </SafeAreaView>
        </ScrollView>
        <View style={{ paddingLeft: 40, paddingBottom: 8, backgroundColor: 'transparent' }}>
          <Text style={{ fontSize: 12, color: "#888" }}>
            {saving ? "Saving..." : "All changes saved"}
          </Text>
        </View>
        {/* Buttons */}
        <View
          style={[
            styles.fabContainer,
            {
              bottom: keyboardHeight ? keyboardHeight + 16 : 24,
            },
          ]}>
          {hasConversation && (
            <FAB
              icon={({ size, color }) => (
                <MaterialIcons name="chat-bubble-outline" size={size} color={color} />
              )}
              onPress={() => router.push({ pathname: "/(screens)/edit-entry/ai-chat", params: { entryId } })}
              disabled={submitting}
              style={styles.secondaryFab}
              color={theme.colors.primary}
            />
          )}

          <FAB
            icon={({ size, color }) => (
              <MaterialIcons name="auto-awesome" size={size} color={color} />
            )}
            onPress={handleResubmit}
            disabled={submitting}
            style={styles.primaryFab}
            color="#ffffff"
          />
        </View>
        <Modal
          visible={menuVisible}
          transparent
          animationType="none"
          onRequestClose={() => setMenuVisible(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={styles.modalOverlay}
            onPress={() => setMenuVisible(false)}
          >
            <MotiView
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.3)' }]}
            />

            <MotiView
              from={{ opacity: 0, scale: 0.9, translateY: 10 }}
              animate={{ opacity: 1, scale: 1, translateY: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 150 }}
              style={styles.menuCard}
            >
              <Text style={styles.menuTitle}>Entry Options</Text>

              <View style={styles.menuSection}>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    setMenuVisible(false);
                    handleResubmit();
                  }}
                >
                  <MaterialIcons name="auto-awesome" size={22} color={theme.colors.primary} />
                  <Text style={styles.menuItemText}>Analyze with AI</Text>
                </TouchableOpacity>

                {hasConversation && (
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => {
                      setMenuVisible(false);
                      router.push({ pathname: "/(screens)/edit-entry/ai-chat", params: { entryId } });
                    }}
                  >
                    <MaterialIcons name="chat-bubble-outline" size={22} color={theme.colors.primary} />
                    <Text style={styles.menuItemText}>Continue Chatting</Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.divider} />

              <TouchableOpacity
                style={[styles.menuItem, styles.deleteItem]}
                onPress={async () => {
                  setMenuVisible(false);
                  await handleDelete();
                  router.back();
                }}
              >
                <MaterialIcons name="delete-outline" size={22} color="#ef4444" />
                <Text style={[styles.menuItemText, { color: "#b91c1c" }]}>Delete Entry</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setMenuVisible(false)}
              >
                <Text style={styles.cancelText}>Dismiss</Text>
              </TouchableOpacity>
            </MotiView>
          </TouchableOpacity>
        </Modal>
      </KeyboardAvoidingView>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  fabContainer: {
    position: "absolute",
    right: 20,
    bottom: 24,
    alignItems: "center",
    gap: 12,
    flexDirection: "row",

  },

  primaryFab: {
    backgroundColor: "#334155",
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },

  secondaryFab: {
    backgroundColor: "white",
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    elevation: 2,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  menuCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    width: "90%",
    maxWidth: 320,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  menuTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 12,
    textAlign: "center",
  },
  menuSection: {
    gap: 4,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
    gap: 12,
    borderRadius: 12,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#334155",
  },
  divider: {
    height: 1,
    backgroundColor: "#f1f5f9",
    marginVertical: 12,
  },
  deleteItem: {
    backgroundColor: "#fff1f2",
  },
  cancelButton: {
    marginTop: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  cancelText: {
    fontSize: 15,
    color: "#64748b",
    fontWeight: "600",
  },
});
