import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
} from "react-native";
import { supabase } from "../lib/supabase";

type Notes = {
  id: string;
  title: string;
  content: string | null;
  created_at: string;
  updated_at: string | null;
};

export default function Index() {
  const router = useRouter();

  const [notes, setNotes] = useState<Notes[]>([]);
  const [loading, setLoading] = useState(false);

  const checkSession = async () => {
    const { data } = await supabase.auth.getSession();

    if (!data.session) {
      router.replace("/auth");
    }
  };

  const loadNotes = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("notes")
      .select("id,title,content,created_at,updated_at")
      .order("created_at", { ascending: false });

    if (!error && data) setNotes(data);

    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, []),
  );

  const logout = async () => {
    await supabase.auth.signOut();
    router.replace("/auth");
  };

  useEffect(() => {
    checkSession();
  }, []);

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
});
