import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useState } from "react";

export default function NewEntryScreen() {
  const [text, setText] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>New Journal Entry</Text>

      <TextInput
        style={styles.input}
        multiline
        placeholder="Write your thoughts..."
        value={text}
        onChangeText={setText}
      />

      <Button title="Save Entry" onPress={() => console.log("Saved:", text)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
  },
  input: {
    backgroundColor: "#f3f3f3",
    height: 200,
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
});
