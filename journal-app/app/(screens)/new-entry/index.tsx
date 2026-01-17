import { useContext, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";
import { AuthContext } from "@/context/AuthContext";
import { API_URL } from "@/lib/api";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  Text,
  TextInput,
  ActivityIndicator,
  IconButton,
} from "react-native-paper";
import { MotiView } from 'moti';
import { useAppTheme } from "@/constants/theme";

export default function NewEntryScreen() {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const theme = useAppTheme();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const entryIdRef = useRef<number | null>(null);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savingRequestRef = useRef<Promise<void> | null>(null);

  const autoSave = (newTitle: string, newBody: string) => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);

    saveTimeout.current = setTimeout(async () => {
      setSaving(true);

      const save = async () => {
        try {
          if (!entryIdRef.current) {
            const res = await axios.post(`${API_URL}/user/${user.id}`, {
              title: newTitle,
              body: newBody,
            });
            entryIdRef.current = res.data.id;
          }
          else if (entryIdRef.current && !newTitle.trim() && !newBody.trim()) {
            await handleDelete()
          } else {
            await axios.put(
              `${API_URL}/user/${user.id}/journal-entry/${entryIdRef.current}`,
              { title: newTitle, body: newBody }
            );
          }
        } catch (err) {
          console.error("Auto-save failed", err);
        } finally {
          setSaving(false);
        }
      };

      if (savingRequestRef.current) {
        await savingRequestRef.current.catch(() => { });
      }

      savingRequestRef.current = save();
      await savingRequestRef.current;
      savingRequestRef.current = null;
    }, 1000);
  };

  const handleDelete = async () => {
    if (!entryIdRef.current) return;
    try {
      await axios.delete(
        `${API_URL}/user/${user.id}/journal-entry/${entryIdRef.current}`
      );
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleBack = async () => {
    if (entryIdRef.current && !title.trim() && !body.trim()) {
      await handleDelete();
    }
    router.back();
  };

  return (
    <MotiView
      from={{
        opacity: 0,
        scale: 0.8,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      exit={{
        opacity: 0,
        scale: 0.8,
      }}
      transition={{
        type: 'timing',
        duration: 400,
      }}
      style={{ flex: 1, backgroundColor: theme.colors.background }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
        >
          <SafeAreaView edges={["top"]} style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
              <IconButton
                icon="arrow-left"
                size={20}
                onPress={handleBack}
                iconColor={theme.colors.primary}
              />

              <TouchableOpacity onPress={() => setMenuVisible(true)}>
                <MaterialIcons name="more-vert" size={26} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>

            {/* Title */}
            <TextInput
              mode="flat"
              label="Title"
              value={title}
              placeholder="Title..."
              placeholderTextColor={theme.colors.onSurfaceVariant}
              onChangeText={(text) => {
                setTitle(text);
                autoSave(text, body);
              }}
              style={[styles.titleInput, { color: theme.colors.primary }]}
            />

            {/* Body */}
            <TextInput
              mode="flat"
              value={body}
              placeholder="Write your thoughts..."
              placeholderTextColor={theme.colors.onSurfaceVariant}
              onChangeText={(text) => {
                setBody(text);
                autoSave(title, text);
              }}
              autoCorrect={true}
              spellCheck={true}
              multiline
              scrollEnabled={false}
              style={[styles.bodyInput, { color: theme.colors.primary }]}
            />
          </SafeAreaView>
        </ScrollView>

        <View style={{ paddingLeft: 40, paddingBottom: 8, backgroundColor: "transparent"}}>
          <Text style={{ fontSize: 12, color: theme.colors.onSurfaceVariant }}>
            {saving ? "Saving..." : "All changes saved"}
          </Text>
        </View>
        <Modal
          visible={menuVisible}
          transparent
          animationType="none"
          onRequestClose={() => setMenuVisible(false)}
        >
          {/* Backdrop */}
          <TouchableOpacity
            activeOpacity={1}
            style={styles.modalOverlay}
            onPress={() => setMenuVisible(false)}
          >
            <MotiView
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ type: 'timing', duration: 300 }}
              style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.4)' }]}
            />

            {/* Animated Menu Card */}
            <MotiView
              from={{ opacity: 0, scale: 0.9, translateY: 20 }}
              animate={{ opacity: 1, scale: 1, translateY: 0 }}
              transition={{ type: 'spring', damping: 15 }}
              style={[styles.menuCard, { backgroundColor: theme.colors.surface }]}
            >
              <View style={styles.menuHeader}>
                <Text style={[styles.menuTitle, { color: theme.colors.onSurfaceVariant }]}>Entry Options</Text>
              </View>

              <TouchableOpacity
                style={[styles.menuItem, { backgroundColor: theme.colors.errorContainer }]}
                onPress={async () => {
                  setMenuVisible(false);
                  await handleDelete();
                  router.back();
                }}
              >
                <View style={styles.deleteIconCircle}>
                  <MaterialIcons name="delete-outline" size={22} color={theme.colors.error} />
                </View>
                <View>
                  <Text style={styles.deleteText}>Delete Entry</Text>
                  <Text style={styles.deleteSubtext}>This action cannot be undone</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setMenuVisible(false)}
              >
                <Text style={[styles.cancelText, { color: theme.colors.onSurfaceVariant }]}>Cancel</Text>
              </TouchableOpacity>
            </MotiView>
          </TouchableOpacity>
        </Modal>
      </KeyboardAvoidingView>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  titleInput: {
    backgroundColor: "transparent",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
  },

  bodyInput: {
    backgroundColor: "transparent",
    fontSize: 16,
    flex: 1,
    marginBottom: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  menuCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    width: "100%",
    maxWidth: 340,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  menuHeader: {
    marginBottom: 16,
    alignItems: "center",
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    gap: 16,
    borderRadius: 12,
  },
  deleteIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fee2e2",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#b91c1c",
  },
  deleteSubtext: {
    fontSize: 12,
    color: "#ef4444",
    opacity: 0.8,
  },
  cancelButton: {
    marginTop: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  cancelText: {
    fontSize: 16,
    color: "#475569",
    fontWeight: "500",
  },
});
