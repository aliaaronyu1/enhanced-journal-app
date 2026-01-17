import { MD3LightTheme, useTheme as usePaperTheme } from "react-native-paper";

const customColors = {
  primary: "#334155",
  onPrimary: "#ffffff",
  primaryContainer: "#475569",
  secondary: "#34C759",
  onSecondary: "#FFFFFF",
  surface: "#f9f9f9",
  surfaceVariant: "#F2F2F7",
  onSurfaceVariant: "#64748b",

  inactiveSlate: "#94a3b8",

  outline: "#e2e8f0",
  error: "#ef4444",
  onError: "#ffffff",
  errorContainer: "#fff1f2",
  background: "#f8fafc",
  
  // Your new custom chat colors
  chatUserBubble: "#e2e8f0",
  chatAiBubble: "#ffffff",
  chatText: "#0f172a",
};

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...customColors,
  },
};

// This creates a "Type" based on your actual theme object
export type AppTheme = typeof theme;

// This is the magic part: a custom hook that returns your AppTheme type
export const useAppTheme = () => usePaperTheme<AppTheme>();