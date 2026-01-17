import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import "react-native-get-random-values";
import { Provider as PaperProvider } from "react-native-paper";
import { lightTheme, darkTheme } from "@/constants/theme";
import { ThemeProvider, useAppThemeContext } from "../context/ThemeContext";
import { StatusBar } from "expo-status-bar";

function RootContent() {
  const { isDarkMode } = useAppThemeContext();

  return (
    <PaperProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen
            name="(screens)/edit-entry/ai-chat"
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="(screens)/edit-entry/[entryId]"
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="(screens)/new-entry/index"
            options={{ 
              animation: 'fade_from_bottom', 
              presentation: 'modal'
            }}
          />
        </Stack>
      </AuthProvider>
    </PaperProvider>
  );
}

export default function Root() {
  return (
    <ThemeProvider>
      <RootContent />
    </ThemeProvider>
  );
}