import { useContext, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
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
  useTheme,
} from "react-native-paper";

export default function NewEntryScreen() {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const theme = useTheme();

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
        await savingRequestRef.current.catch(() => {});
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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
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
              iconColor="#334155"
            />

            <TouchableOpacity onPress={() => setMenuVisible(true)}>
              <MaterialIcons name="more-vert" size={26} color="#374151" />
            </TouchableOpacity>
          </View>

          {/* Title */}
          <TextInput
            mode="flat"
            label="Title"
            value={title}
            placeholder="Title..."
            onChangeText={(text) => {
              setTitle(text);
              autoSave(text, body);
            }}
            style={styles.titleInput}
          />

          {/* Body */}
          <TextInput
            mode="flat"
            value={body}
            placeholder="Write your thoughts..."
            onChangeText={(text) => {
              setBody(text);
              autoSave(title, text);
            }}
            multiline
            scrollEnabled={false}
            style={styles.bodyInput}
          />

          {/* Saving indicator */}
          <Text style={styles.savingText}>
            {saving ? "Saving..." : "All changes saved"}
          </Text>
        </SafeAreaView>
      </ScrollView>

      {/* Delete Modal (unchanged behavior, improved look) */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menu}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={async () => {
                setMenuVisible(false);
                await handleDelete();
                router.back();
              }}
            >
              <MaterialIcons name="delete" size={20} color="#b91c1c" />
              <Text style={[styles.menuText, { color: "#b91c1c" }]}>
                Delete entry
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </KeyboardAvoidingView>
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

  savingText: {
    fontSize: 12,
    color: "#888",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.1)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 50,
    paddingRight: 12,
  },

  menu: {
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 6,
    paddingVertical: 8,
    width: 160,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 10,
  },

  menuText: {
    fontSize: 16,
  },
});
