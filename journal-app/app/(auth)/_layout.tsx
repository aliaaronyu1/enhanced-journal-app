import { Slot, useRouter } from "expo-router";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function AuthLayout() {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      // If user is logged in, prevent them from accessing Login/Register
      router.replace("/(tabs)");
    }
  }, [user]);

  return <Slot />;
}
