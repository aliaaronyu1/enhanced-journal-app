import { useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { View, FlatList, Pressable, RefreshControl, StyleSheet } from "react-native";
import { AuthContext } from "@/context/AuthContext";
import { useRouter, useFocusEffect } from "expo-router";
import { API_URL } from "@/lib/api";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  Text,
  Card,
  FAB,
  Divider,
  ActivityIndicator
} from "react-native-paper";
import { MotiView } from "moti";
import { MotiPressable } from 'moti/interactions';
import { useAppTheme } from "@/constants/theme";

export default function HomeScreen() {
  const { user } = useContext(AuthContext);
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const theme = useAppTheme();
  const [fabIsPressed, setFabIsPressed] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (user?.id) {
        fetchUsersEntries(user.id);
      }
    }, [user])
  );

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
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={{ paddingHorizontal: 10, paddingTop: 12, flex: 1, backgroundColor: theme.colors.background }}>
      <SafeAreaView edges={['top']} style={styles.header}>
        <Text variant="headlineLarge" style={[styles.title, { color: theme.colors.onBackground}]}>
          My Journal
        </Text>
      </SafeAreaView>

      {entries.length === 0 ? (
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
          Recent entries will appear here.
        </Text>
      ) : (
        <FlatList
            data={entries}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ padding: 10 }}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={() => user?.id && fetchUsersEntries(user.id)}
                tintColor={theme.colors.onPrimary}
                title="Updating your journal..."
                titleColor={theme.colors.onPrimary}
              />
            }
            renderItem={({ item }) => (
              <MotiPressable
              onPress={() => handleUpdateEntry(item.id)}
              animate={({ pressed }) => {
                'worklet';
                return {
                  scale: pressed ? 0.96 : 1,
                  opacity: pressed ? 0.9 : 1,
                };
              }}
              transition={{
                type: 'spring',
                damping: 15,
                stiffness: 300,
              }}
              style={{ marginBottom: 12 }}
            >
              <Card
                style={{
                  backgroundColor: theme.colors.surface,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
                  shadowRadius: 2,
                }}
                elevation={1}
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
                      style={{ flex: 1, fontWeight: '600' }}
                    >
                      {item.title || "Untitled"}
                    </Text>
                    <Text variant="labelSmall" style={{ marginLeft: 8, color: theme.colors.onSurfaceVariant }}>
                      {item.formattedDate}
                    </Text>
                  </View>

                  <Divider style={{ marginVertical: 8 }} />

                  <Text
                    variant="bodyMedium"
                    numberOfLines={6}
                    style={{ color: theme.colors.primary, lineHeight: 20 }}
                  >
                    {item.body}
                  </Text>
                </Card.Content>
              </Card>
            </MotiPressable>
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
          // borderRadius: 40
        }}
      >
        <Pressable
          onPressIn={() => setFabIsPressed(true)}
          onPressOut={() => setFabIsPressed(false)}
          onPress={handleAddEntry}
        >
          <MotiView
            animate={{
              scale: fabIsPressed ? 0.9 : 1,
              backgroundColor: fabIsPressed ? theme.colors.primaryContainer : theme.colors.primary,
            }}
            transition={{
              type: 'spring',
              damping: 10,
              stiffness: 500,
            }}
            style={{
              borderRadius: 40,
              elevation: 4,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 4.65,
            }}
          >
            <View pointerEvents="none">
              <FAB
                icon={() => (
                  <MaterialCommunityIcons name="pencil" size={20} color="#fff" />
                )}
                label="Begin Writing"
                onPress={handleAddEntry}
                style={{ backgroundColor: 'transparent' }}
                theme={{ roundness: 40 }}
                color="#fff"
              />
            </View>
          </MotiView>
        </Pressable>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  
  header: {
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  title: {
    // fontWeight: "800",
    color: "#1e293b",
  },
})