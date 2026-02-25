import { View, Text, Button } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Notes = {
  id: string;
  title: string;
  content: string | null;
  created_at: string;
};

export default function NoteDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [note, setNote] = useState<Notes | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("notes")
        .select("id,title,content,created_at")
        .eq("id", id)
        .single();

      if (!error) setNote(data);
    };

    load();
  }, [id]);

  if (!note) return null;

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>{note.title}</Text>
      <Text style={{ marginTop: 20 }}>{note.content}</Text>
      <Button title="Back" onPress={() => router.back()} />
    </View>
  );
}
