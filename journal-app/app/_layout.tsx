import { Slot } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import "react-native-get-random-values";

export default function Root() {
  return (
      <AuthProvider>
        <Slot />
      </AuthProvider>
  );
}