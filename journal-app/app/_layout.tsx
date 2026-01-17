import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import "react-native-get-random-values";
import { Provider as PaperProvider, MD3LightTheme } from "react-native-paper";
import { theme } from "../constants/theme";

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