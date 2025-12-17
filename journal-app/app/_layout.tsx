import { Slot } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Root() {
  return (
    <SafeAreaView style={{flex: 1}}>
      <AuthProvider>
        <Slot />
      </AuthProvider>
    </SafeAreaView>

  );
}