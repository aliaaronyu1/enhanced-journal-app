import React, { useContext, useState } from "react";
import { View, StyleSheet, Alert, ScrollView } from "react-native";
import { List, Text, Divider, Switch, Avatar, Button } from "react-native-paper";
import { AuthContext } from "../../../context/AuthContext";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "@/constants/theme";

export default function SettingsScreen() {
  const { user, logout } = useContext(AuthContext);
  const router = useRouter();
  const theme = useAppTheme();
  
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
    <View style={{flex: 1}}>
      <SafeAreaView edges={['top']} style={styles.header}>
        <Text variant="headlineLarge" style={[styles.title, { color: theme.colors.primary }]}>Settings</Text>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Section */}
        <View style={styles.profileCard}>
          <Avatar.Text 
            size={64} 
            label={user?.name?.[0] || "U"} 
            style={{ backgroundColor: theme.colors.primaryContainer }} 
            labelStyle={{color: theme.colors.onPrimary}}
          />
          <View style={styles.profileInfo}>
            <Text variant="titleLarge" style={{ color: theme.colors.primary }}>{user?.name || "Journal User"}</Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>{user?.email}</Text>
          </View>
        </View>

        <List.Section>
          <List.Subheader style={{ color: theme.colors.onSurfaceVariant }}>Preferences</List.Subheader>
          <List.Item
            title="Dark Mode"
            titleStyle={{ color: theme.colors.primary }}
            left={props => <List.Icon {...props} icon="brightness-6" color={theme.colors.primary}/>}
            right={() => (
              <Switch value={isDarkMode} onValueChange={() => setIsDarkMode(!isDarkMode)} color={theme.colors.primaryContainer} />
            )}
          />
          <Divider style={{ backgroundColor: theme.colors.outline }}/>
          <List.Item
            title="Notifications"
            titleStyle={{ color: theme.colors.primary }}
            left={props => <List.Icon {...props} icon="bell-outline" color={theme.colors.primary}/>}
            onPress={() => {}}
          />
        </List.Section>

        <List.Section>
          <List.Subheader style={{ color: theme.colors.onSurfaceVariant }}>Account</List.Subheader>
          <List.Item
            title="Edit Profile"
            titleStyle={{ color: theme.colors.primary }}
            left={props => <List.Icon {...props} icon="account-edit-outline" color={theme.colors.primary} />}
            right={props => <List.Icon {...props} icon="chevron-right" color={theme.colors.onSurfaceVariant}/>}
            onPress={() => {}}
          />
          <Divider style={{ backgroundColor: theme.colors.outline }}/>
          <List.Item
            title="Logout"
            titleStyle={{ color: theme.colors.error }}
            left={props => <List.Icon {...props} icon="logout" color={theme.colors.error} />}
            onPress={handleLogout}
            disabled={loading}
          />
        </List.Section>

        <View style={styles.footer}>
          <Text variant="labelSmall" style={{color: theme.colors.onSurfaceVariant}}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  title: {
    fontWeight: "700",
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
});