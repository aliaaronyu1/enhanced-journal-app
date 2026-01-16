import { View, StyleSheet } from "react-native";
import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useRouter } from "expo-router";
import { API_URL } from "@/lib/api";

import {
  Text,
  TextInput,
  Button,
  Card,
  useTheme,
  ActivityIndicator,
} from "react-native-paper";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const router = useRouter();
  const theme = useTheme();

  const handleRegister = async () => {
    if (!email || !password) return;

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/auth/register`, {
        email,
        password,
      });
      login(res.data.user, res.data.token);
      router.replace("/(tabs)");
    } catch (err: any) {
      alert(err.response?.data?.msg || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Card
        style={{ ...styles.card, backgroundColor: theme.colors.surface }}
        elevation={0}
      >
        <Card.Content>
          <Text variant="headlineLarge" style={styles.title}>
            Create account
          </Text>

          <Text
            variant="bodyMedium"
            style={{ color: "#6b7280", marginBottom: 24 }}
          >
            Start your journaling journey
          </Text>

          <TextInput
            label="Email"
            mode="outlined"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
          />

          <TextInput
            label="Password"
            mode="outlined"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />

          <Button
            mode="contained"
            onPress={handleRegister}
            style={styles.button}
            contentStyle={{ paddingVertical: 6 }}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              "Register"
            )}
          </Button>

          <Button
            mode="text"
            onPress={() => router.push("/(auth)/login")}
            style={{ marginTop: 12 }}
          >
            Already have an account? Login
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f8fafc",
  },
  card: {
    paddingVertical: 12,
  },
  title: {
    marginBottom: 8,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    borderRadius: 12,
  },
});
