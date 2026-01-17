import { View, StyleSheet, TouchableWithoutFeedback, Keyboard } from "react-native";
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
  ActivityIndicator,
} from "react-native-paper";
import { useAppTheme } from "@/constants/theme";


export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const router = useRouter();
  const theme = useAppTheme();

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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>

      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Card
          style={{ ...styles.card, backgroundColor: theme.colors.surface }}
          elevation={0}
        >
          <Card.Content>
            <Text variant="headlineLarge" style={[styles.title, { color: theme.colors.primary }]}>
              Create account
            </Text>

            <Text
              variant="bodyMedium"
              style={{ color: theme.colors.inactiveSlate, marginBottom: 24 }}
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
              outlineColor={theme.colors.outline}
              activeOutlineColor={theme.colors.primary}
            />

            <TextInput
              label="Password"
              mode="outlined"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
              outlineColor={theme.colors.outline}
              activeOutlineColor={theme.colors.primary}
            />

            <Button
              mode="contained"
              onPress={handleRegister}
              style={[styles.button, { backgroundColor: theme.colors.primary }]}
              contentStyle={{ paddingVertical: 6 }}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={theme.colors.onPrimary} />
              ) : (
                "Register"
              )}
            </Button>

            <Button
              mode="text"
              onPress={() => router.push("/(auth)/login")}
              style={{ marginTop: 12 }}
              textColor={theme.colors.onSurfaceVariant}
            >
              Already have an account? Login
            </Button>
          </Card.Content>
        </Card>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
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
