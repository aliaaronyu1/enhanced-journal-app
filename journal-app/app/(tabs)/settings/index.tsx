import { Button } from "react-native";
import { View, Text, StyleSheet, Alert } from "react-native";
import { AuthContext } from "../../../context/AuthContext";
import { useContext, useState } from "react";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const { user, logout } = useContext(AuthContext);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      logout();
      router.replace("/(auth)/login"); // navigate to home after login
    } catch (err: any) {
      Alert.alert(err.response?.data?.msg || "Logout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']}>
        <Text style={styles.title}>Settings</Text>
      </SafeAreaView>
      <Text>Preferences, app theme, and account options will go here.</Text>
      <Button title={loading ? "Logging out..." : "Logout"} disabled={loading} onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
  },
});
