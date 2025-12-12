import { Tabs, Redirect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { View, ActivityIndicator } from "react-native";

export default function RootLayout() {
  const { user } = useContext(AuthContext);

  if (user === undefined) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator />
    </View>
  );
  
  // If not logged in redirect to login screen
  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />


      <Tabs.Screen
        name="settings/index"
        options={{
          title: "Settings",
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}