import { Slot } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import "react-native-get-random-values";
import { Provider as PaperProvider, MD3LightTheme } from "react-native-paper";

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,

    primary: "#007AFF",
    onPrimary: "#FFFFFF",

    primaryContainer: "#334155",
    onPrimaryContainer: "#FFFFFF",

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
        <Slot />
      </AuthProvider>
    </PaperProvider>
  );
}