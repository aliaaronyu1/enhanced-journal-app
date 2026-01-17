// import { MD3LightTheme, useTheme as usePaperTheme } from "react-native-paper";

// const customColors = {
//   primary: "#334155",
//   onPrimary: "#ffffff",
//   primaryContainer: "#475569",
//   secondary: "#34C759",
//   onSecondary: "#FFFFFF",
//   surface: "#f9f9f9",
//   surfaceVariant: "#F2F2F7",
//   onSurfaceVariant: "#64748b",

//   inactiveSlate: "#94a3b8",

//   outline: "#e2e8f0",
//   error: "#ef4444",
//   onError: "#ffffff",
//   errorContainer: "#fff1f2",
//   background: "#f8fafc",
  
//   // Your new custom chat colors
//   chatUserBubble: "#e2e8f0",
//   chatAiBubble: "#ffffff",
//   chatText: "#0f172a",
// };

// export const theme = {
//   ...MD3LightTheme,
//   colors: {
//     ...MD3LightTheme.colors,
//     ...customColors,
//   },
// };

// // This creates a "Type" based on your actual theme object
// export type AppTheme = typeof theme;

// // This is the magic part: a custom hook that returns your AppTheme type
// export const useAppTheme = () => usePaperTheme<AppTheme>();
import { MD3LightTheme, MD3DarkTheme, useTheme as usePaperTheme } from "react-native-paper";

// --- LIGHT THEME ---
const lightColors = {
  primary: "#334155",
  onPrimary: "#ffffff",
  primaryContainer: "#475569",
  secondary: "#34C759",
  surface: "#f9f9f9",
  outline: "#e2e8f0",
  background: "#f8fafc",
  inactiveSlate: "#94a3b8",
  chatUserBubble: "#e2e8f0",
  chatAiBubble: "#ffffff",
  chatText: "#0f172a",
};

// --- DARK THEME ---
const darkColors = {
  primary: "#94a3b8",        // Lighter slate for better contrast on dark
  onPrimary: "#0f172a",
  primaryContainer: "#334155",
  secondary: "#34C759",
  surface: "#1e293b",        // Deep slate
  outline: "#334155",
  background: "#0f172a",     // Darkest slate
  inactiveSlate: "#64748b",
  chatUserBubble: "#334155",
  chatAiBubble: "#1e293b",
  chatText: "#f8fafc",       // Off-white text for chat
};

export const lightTheme = {
  ...MD3LightTheme,
  colors: { ...MD3LightTheme.colors, ...lightColors },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: { ...MD3DarkTheme.colors, ...darkColors },
};

export type AppTheme = typeof lightTheme;
export const useAppTheme = () => usePaperTheme<AppTheme>();