import {
  View,
  Text,
  Button,
  FlatList,
  Pressable,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Session } from "@supabase/supabase-js";

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
  const [session, setSession] = useState<Session | null>(null);

  const loadNotes = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("notes")
      .select("id,title,content,created_at")
      .order("created_at", { ascending: false });

    if (!error && data) setNotes(data);

    setLoading(false);
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    router.replace("/auth");
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text
        style={{ position: "absolute", top: 20, left: 20, fontWeight: "bold" }}
      >
        Job Notes
      </Text>
      <FlatList
        style={{ paddingTop: 30 }}
        data={notes}
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

      <View style={{ position: "absolute", bottom: 40, alignSelf: "center" }}>
        <Button title="Add Note" onPress={() => router.push("/note")} />
        <Button title="Logout" onPress={logout} />
      </View>
    </View>
  );
}
