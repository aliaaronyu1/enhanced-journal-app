import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect, useContext } from "react";
import { View, TextInput, Button, StyleSheet, Alert, ActivityIndicator, Text, TouchableOpacity, Modal, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import axios from "axios";
import { AuthContext } from "@/context/AuthContext";
import { useRef } from "react";
import { API_URL } from "@/lib/api";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditEntryScreen() {
  const { user } = useContext(AuthContext);
  const { entryId } = useLocalSearchParams(); // entry ID from route
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const [menuVisible, setMenuVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const savingRequestRef = useRef<Promise<void> | null>(null);

  useEffect(() => {
    fetchEntry();
  }, []);

  const fetchEntry = async () => {
    try {
      const res = await axios.get(`${API_URL}/user/${user.id}/journal-entry/${entryId}`);
      setTitle(res.data.title);
      setBody(res.data.body);
    } catch (error) {
      Alert.alert("Error", "Could not load entry");
    } finally {
      setLoading(false);
    }
  };

  const autoSave = (newTitle: string, newBody: string) => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);

    saveTimeout.current = setTimeout(async () => {
      setSaving(true);
      const save = async () => {
        try {
          if (!newTitle.trim() && !newBody.trim()) {
            // optionally skip saving empty content
            console.log("Empty content, skipping autosave");
            return;
          }
          await axios.put(`${API_URL}/user/${user.id}/journal-entry/${entryId}`, {
            title: newTitle,
            body: newBody,
          });
          console.log("Auto-saved");
        } catch (err) {
          console.error("Auto-save failed", err);
        } finally {
          setSaving(false);
        }
      }

      if (savingRequestRef.current) {
        await savingRequestRef.current.catch(() => { })
      }

      savingRequestRef.current = save();
      await savingRequestRef.current
      savingRequestRef.current = null

    }, 1000);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/user/${user.id}/journal-entry/${entryId}`);
    } catch (error) {
      console.error("Failed to delete empty draft", error);
    }
  };

  const handleBack = async () => {
    if (!title.trim() && !body.trim()) {
      await handleDelete();
    }
    router.back();
  }
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    )
  }
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={0}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive">
        <View style={styles.container}>
          <SafeAreaView edges={['top']}>
            <View style={styles.header}>
              <TouchableOpacity onPress={handleBack}>
                <Text style={{ fontSize: 16, color: "#007AFF" }}>← Back</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setMenuVisible(true)}>
                <MaterialIcons name="more-vert" size={28} color="black" />
              </TouchableOpacity>
            </View>
          </SafeAreaView>

          <TextInput
            style={styles.titleInput}
            value={title}
            onChangeText={(text) => {
              setTitle(text);
              autoSave(text, body);
            }}
          />

          <TextInput
            style={[styles.input]}
            value={body}
            onChangeText={(text) => {
              setBody(text);
              autoSave(title, text);
            }}
            multiline
            scrollEnabled={false}
          />
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
                  <MaterialIcons name="delete" size={20} color="red" />
                  <Text style={[styles.menuText, { color: "red" }]}>Delete</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>
          <Text style={{ fontSize: 12, color: "#888" }}>
            {saving ? "Saving..." : "All changes saved"}
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  titleInput: {
    fontWeight: "bold",
    padding: 12,
    borderRadius: 8,
    fontSize: 20
  },
  input: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    minHeight: 200
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    elevation: 5,
    paddingVertical: 8,
    width: 140,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 8,
  },
  menuText: {
    fontSize: 16,
  },
});
