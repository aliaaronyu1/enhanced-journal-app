import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import "react-native-get-random-values";
import { Provider as PaperProvider, MD3LightTheme } from "react-native-paper";

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,

    primary: "#334155",
    onPrimary: "#94a3b8",

    primaryContainer: "#334155",
    onPrimaryContainer: "#94a3b8",

    secondary: "#34C759",
    onSecondary: "#FFFFFF",

    surface: "#f9f9f9",
    surfaceVariant: "#F2F2F7",

  },
};


export default function Root() {
  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />

          <Stack.Screen
            name="(screens)/edit-entry/ai-chat"
            options={{
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="(screens)/edit-entry/[entryId]"
            options={{ animation: 'fade_from_bottom' }}
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