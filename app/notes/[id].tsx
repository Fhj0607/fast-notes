import { View, Text, Pressable, TextInput, Alert } from "react-native";
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
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const [note, setNote] = useState<Notes | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState("");

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

  useEffect(() => {
    if (note) {
      setDraft(note.content ?? "");
    }
  }, [note]);

  if (!note) return null;
  if (!id) return null;

  const onSave = async () => {
    if (!id) return <Text style={{ padding: 20 }}>Missing id</Text>;
    if (!note) return <Text style={{ padding: 20 }}>Loading...</Text>;
    const { data, error } = await supabase
      .from("notes")
      .update({ content: draft })
      .eq("id", note.id)
      .select("id,title,content,created_at")
      .single();
    if (error) {
      Alert.alert("save failed", error.message);
      return;
    }
    setNote(data);
    setIsEditing(false);
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>{note.title}</Text>
      {!isEditing ? (
        <Text style={{ marginTop: 20 }}>{note?.content ?? ""}</Text>
      ) : (
        <TextInput
          style={{ marginTop: 20, borderWidth: 1, padding: 10 }}
          multiline
          value={draft}
          onChangeText={setDraft}
        />
      )}
      <View style={{ position: "absolute", bottom: 20, alignSelf: "center" }}>
        <Pressable onPress={() => (isEditing ? onSave() : setIsEditing(true))}>
          {!isEditing ? <Text>Edit</Text> : <Text>Save</Text>}
        </Pressable>
        <Pressable onPress={() => router.back()}>
          <Text>Back</Text>
        </Pressable>
      </View>
    </View>
  );
}
