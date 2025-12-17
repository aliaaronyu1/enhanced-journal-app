import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useRouter } from "expo-router";
import { API_URL } from "@/lib/api";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert("Please fill all fields");
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      login(res.data.user, res.data.token);
      router.replace("/(tabs)"); // navigate to home after login
    } catch (err: any) {
      Alert.alert(err.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button title={loading ? "Logging in..." : "Login"} onPress={handleLogin} />
      <Text style={styles.switch} onPress={() => router.push("/(auth)/register")}>
        Don't have an account? Register
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24 },
  title: { fontSize: 32, fontWeight: "bold", marginBottom: 24 },
  input: { backgroundColor: "#f3f3f3", padding: 12, marginBottom: 16, borderRadius: 8 },
  switch: { marginTop: 16, color: "blue" },
});
