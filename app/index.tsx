import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
} from "react-native";
import { supabase } from "../lib/supabase";

type note = {
  id: string;
  title: string;
  content: string | null;
  created_at: string;
  updated_at: string | null;
};

export default function Index() {
  const router = useRouter();

  const NOTE_COUNT = 5;

  const [notes, setNotes] = useState<note[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  const loadNotes = async () => {
    setLoading(true);

    const { data, error, count } = await supabase
      .from("notes")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(0, 4);

    if (error) {
      Alert.alert("Error", error.message);
      setLoading(false);
      return;
    }

    const fetched = data ?? [];
    setNotes(fetched);
    setHasMore((count ?? 0) > fetched.length);
    setLoading(false);
  };

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);

    const start = notes.length;
    const end = start + NOTE_COUNT - 1;

    const { data, error, count } = await supabase
      .from("notes")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(start, end);

    if (error) {
      Alert.alert("Error", error.message);
      setLoadingMore(false);
      return;
    }

    const fetched = data ?? [];
    const updatedNotes = [...notes, ...fetched];

    setNotes(updatedNotes);
    setHasMore(updatedNotes.length < (count ?? 0));
    setLoadingMore(false);
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    router.replace("/auth");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, padding: 20 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text
        style={{ position: "absolute", top: 20, left: 20, fontWeight: "bold" }}
      >
        Job Notes
      </Text>
      <FlatList
        style={{ paddingTop: 30 }}
        data={notes}
        refreshing={loading}
        onRefresh={loadNotes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/notes/${item.id}` as any)}
            style={{
              padding: 15,
              borderWidth: 1,
              marginBottom: 12,
            }}
          >
            <Text style={{ fontSize: 16 }}>{item.title}</Text>
          </Pressable>
        )}
        ListFooterComponent={
          hasMore ? (
            <Pressable
              onPress={loadMore}
              disabled={loadingMore}
              style={styles.loadMoreBtn}
            >
              <Text style={styles.loadMoreText}>
                {loadingMore ? "Loading..." : "Load more"}
              </Text>
            </Pressable>
          ) : null
        }
      />
      <Pressable style={styles.blueBtn} onPress={() => router.push("/note")}>
        <Text style={styles.btnText}>ADD NOTE</Text>
      </Pressable>
      <Pressable style={styles.blueBtn} onPress={logout}>
        <Text style={styles.btnText}>LOGOUT</Text>
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  blueBtn: {
    marginVertical: 5,
    padding: 15,
    backgroundColor: "#1E90FF",
    borderRadius: 8,
  },
  blueBtnSmall: {
    flex: 0.48,
    padding: 10,
    backgroundColor: "#1E90FF",
    borderRadius: 8,
  },
  btnText: { color: "white", textAlign: "center", fontWeight: "600" },

  loadMoreBtn: {
    marginVertical: 16,
    padding: 12,
    backgroundColor: "#1E90FF",
    borderRadius: 8,
  },
  loadMoreText: { color: "white", fontWeight: "600", textAlign: "center" },
});
