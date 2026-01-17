import React, { useContext, useState } from "react";
import { View, StyleSheet, Alert, ScrollView } from "react-native";
import { List, Text, Divider, Switch, useTheme, Avatar, Button } from "react-native-paper";
import { AuthContext } from "../../../context/AuthContext";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";

export default function SettingsScreen() {
  const { user, logout } = useContext(AuthContext);
  const router = useRouter();
  const theme = useTheme();
  
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            setLoading(true);
            await logout();
            router.replace("/(auth)/login");
          } catch (err: any) {
            Alert.alert("Error", "Logout failed");
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <SafeAreaView edges={['top']} style={styles.header}>
        <Text variant="headlineLarge" style={styles.title}>Settings</Text>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Section */}
        <View style={styles.profileCard}>
          <Avatar.Text 
            size={64} 
            label={user?.name?.[0] || "U"} 
            style={{ backgroundColor: theme.colors.primaryContainer }} 
          />
          <View style={styles.profileInfo}>
            <Text variant="titleLarge">{user?.name || "Journal User"}</Text>
            <Text variant="bodyMedium" style={{ color: '#64748b' }}>{user?.email}</Text>
          </View>
        </View>

        <List.Section>
          <List.Subheader>Preferences</List.Subheader>
          <List.Item
            title="Dark Mode"
            left={props => <List.Icon {...props} icon="brightness-6" />}
            right={() => (
              <Switch value={isDarkMode} onValueChange={() => setIsDarkMode(!isDarkMode)} />
            )}
          />
          <Divider />
          <List.Item
            title="Notifications"
            left={props => <List.Icon {...props} icon="bell-outline" />}
            onPress={() => {}}
          />
        </List.Section>

        <List.Section>
          <List.Subheader>Account</List.Subheader>
          <List.Item
            title="Edit Profile"
            left={props => <List.Icon {...props} icon="account-edit-outline" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
          />
          <Divider />
          <List.Item
            title="Logout"
            titleStyle={{ color: theme.colors.error }}
            left={props => <List.Icon {...props} icon="logout" color={theme.colors.error} />}
            onPress={handleLogout}
            disabled={loading}
          />
        </List.Section>

        <View style={styles.footer}>
          <Text variant="labelSmall" style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  title: {
    // fontWeight: "800",
    color: "#1e293b",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    marginBottom: 8,
  },
  profileInfo: {
    marginLeft: 16,
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
  versionText: {
    color: '#94a3b8',
  }
});