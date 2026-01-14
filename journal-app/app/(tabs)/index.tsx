import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { View, FlatList, ActivityIndicator } from "react-native";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { API_URL } from "@/lib/api";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  Text,
  Card,
  FAB,
  Divider,
  useTheme
} from "react-native-paper";

export default function HomeScreen() {
  const { user } = useContext(AuthContext);
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const theme = useTheme();

  useEffect(() => {
    if (user?.id) {
      fetchUsersEntries(user.id);
    }
  }, [user]);

  const formatEntryTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(diffMs / 60_000);
    const hours = Math.floor(diffMs / 3_600_000);
    const days = Math.floor(diffMs / 86_400_000);

    if (days >= 3) {
      // Older than 3 days → show full date
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }) + " • " + date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      });
    }

    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    return `Just now`;
  };

  const fetchUsersEntries = async (userId: number) => {
    try {
      const res = await axios.get(`${API_URL}/user/${userId}`);
      setEntries(
        res.data.map((entry: any) => ({
          ...entry,
          formattedDate: formatEntryTime(entry.created_at),
        }))
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEntry = (entryId: number) => {
    router.push({
      pathname: "/edit-entry/[entryId]",
      params: { entryId },
    });
  };

  const handleAddEntry = () => {
    router.push("/new-entry");
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ paddingHorizontal: 10, paddingTop: 12, flex: 1 }}>
      <SafeAreaView edges={['top']}>

        <Text variant="headlineLarge" style={{ marginBottom: 12 }}>
          My Journal
        </Text>
      </SafeAreaView>

      {entries.length === 0 ? (
        <Text variant="bodyMedium" style={{ color: "#6b7280" }}>
          Recent entries will appear here.
        </Text>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 10 }}
          renderItem={({ item }) => (
            <Card
              style={{
                marginBottom: 12,
                backgroundColor: theme.colors.surface,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
               }}
              elevation={1}
              onPress={() => handleUpdateEntry(item.id)}
            >
              <Card.Content>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text
                    variant="titleMedium"
                    numberOfLines={1}
                    style={{ flex: 1 }}
                  >
                    {item.title || "Untitled"}
                  </Text>
                  <Text variant="labelSmall" style={{ marginLeft: 8 }}>
                    {item.formattedDate}
                  </Text>
                </View>

                <Divider style={{ marginVertical: 8 }} />

                <Text
                  variant="bodyMedium"
                  numberOfLines={6}
                  style={{ color: "#374151" }}
                >
                  {item.body}
                </Text>
              </Card.Content>
            </Card>
          )}
        />
      )}

      <View
        style={{
          position: "absolute",
          bottom: 20,
          left: 0,
          right: 0,
          alignItems: "center",
          borderRadius: 40
        }}
      >
        <FAB
          label="Begin Writing"
          onPress={handleAddEntry}
          theme={{ roundness: 40 }}
        />
      </View>

    </View>
  );
}
