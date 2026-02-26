import {
  View,
  Text,
  Platform,
  KeyboardAvoidingView,
  FlatList,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabase";

type Notes = {
  id: string;
  title: string;
  content: string | null;
  created_at: string;
};

export default function Index() {
  const router = useRouter();

  const [notes, setNotes] = useState<Notes[]>([]);
  const [loading, setLoading] = useState(false);

  const loadNotes = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("notes")
      .select("id,title,content,created_at")
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

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, padding: 20 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
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
      <Pressable
        style={{ margin: 10, padding: 10, backgroundColor: "#1E90FF" }}
        onPress={() => router.push("/note")}
      >
        <Text style={{ color: "white", textAlign: "center" }}>ADD NOTE</Text>
      </Pressable>
      <Pressable
        style={{ margin: 10, padding: 10, backgroundColor: "#1E90FF" }}
        onPress={logout}
      >
        <Text style={{ color: "white", textAlign: "center" }}>LOGOUT</Text>
      </Pressable>
    </KeyboardAvoidingView>
  );
}
