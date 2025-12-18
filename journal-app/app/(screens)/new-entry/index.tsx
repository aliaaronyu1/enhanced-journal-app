import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Modal } from "react-native";
import { useContext, useState, useRef } from "react";
import axios from "axios";
import { useRouter } from "expo-router";
import { AuthContext } from "@/context/AuthContext";
import { API_URL } from "@/lib/api";
import { MaterialIcons } from "@expo/vector-icons";

export default function NewEntryScreen() {
  const { user } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [ saving, setSaving ] = useState(false);
  const [ body, setBody ] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);
  const entryIdRef = useRef<number | null>(null);
  const saveTimeout = useRef<number | null>(null);
  const savingRequestRef = useRef<Promise<void> | null>(null);
  const router = useRouter();

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
            const newId = res.data.id
            entryIdRef.current = newId;
          } else {
            await axios.put(`${API_URL}/user/${user.id}/journal-entry/${entryIdRef.current}`, {
              title: newTitle,
              body: newBody,
            });
          }
          console.log("Auto-saved");
        } catch (err) {
          console.error("Auto-save failed", err);
        } finally {
          setSaving(false);
        }
      }

      //if a previous state is running, wait for it to finish to avoid race conditions
      if (savingRequestRef.current) {
        await savingRequestRef.current.catch(() => {});//ignore previous errors
      }

      //track this save request
      savingRequestRef.current = save();
      await savingRequestRef.current;
      savingRequestRef.current = null;
    }, 1000);
  };

  const handleDelete = async () => {
    if (!entryIdRef.current) return;
    try {
      await axios.delete(`${API_URL}/user/${user.id}/journal-entry/${entryIdRef.current}`);
    } catch (error) {
      console.error("Failed to delete empty draft", error);
    }
  };

  const handleBack = async () => {
    if(!title && !body && entryIdRef.current) {
      await handleDelete();
    }
    router.back();
  }
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleBack}>
        <Text style={{ fontSize: 16, color: "#007AFF" }}>← Back</Text>
      </TouchableOpacity>
      <View style={styles.header}>
        <Text style={styles.title}>New Journal Entry</Text>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <MaterialIcons name="more-vert" size={28} color="black" />
        </TouchableOpacity>
      </View>
      
      <TextInput
        style={styles.titleInput}
        placeholder="Title..."
        value={title}
        onChangeText={(text) => {
          autoSave(text, body)
          setTitle(text)
        }}
      />
      <TextInput
        style={styles.input}
        multiline
        placeholder="Write your thoughts..."
        value={body}
        onChangeText={(text) => {
          autoSave(title, text)
          setBody(text)
        }}
      />
      {/* Delete modal */}
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
              onPress={() => {
                setMenuVisible(false);
                handleDelete();
                router.back();
              }}
            >
              <MaterialIcons name="delete" size={20} color="red" />
              <Text style={[styles.menuText, { color: "red" }]}>Delete</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
  },
  titleInput: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  input: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    flex: 1
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
