import {
  View,
  Text,
  Pressable,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
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

  const onDelete = async () => {
    if (!id) return <Text style={{ padding: 20 }}>Missing id</Text>;
    if (!note) return <Text style={{ padding: 20 }}>Loading...</Text>;
    const { error } = await supabase.from("notes").delete().eq("id", note.id);

    if (error) {
      Alert.alert("Delete failed", error.message);
      return;
    }

    router.back();
  };

  const onCancel = () => {
    if (!id) return <Text style={{ padding: 20 }}>Missing id</Text>;
    if (!note) return <Text style={{ padding: 20 }}>Loading...</Text>;

    setDraft(note.content ?? "");
    setIsEditing(false);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, padding: 20 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
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
      <View style={{ marginTop: 20 }}>
        <Pressable
          style={{ margin: 10, padding: 10, backgroundColor: "#1E90FF" }}
          onPress={() => (isEditing ? onSave() : setIsEditing(true))}
        >
          {!isEditing ? (
            <Text style={{ color: "white", textAlign: "center" }}>EDIT</Text>
          ) : (
            <Text style={{ color: "white", textAlign: "center" }}>SAVE</Text>
          )}
        </Pressable>
        <Pressable
          style={{ margin: 10, padding: 10, backgroundColor: "#1E90FF" }}
          onPress={() => (isEditing ? onCancel() : router.back())}
        >
          {!isEditing ? (
            <Text style={{ color: "white", textAlign: "center" }}>BACK</Text>
          ) : (
            <Text style={{ color: "white", textAlign: "center" }}>CANCEL</Text>
          )}
        </Pressable>

        <Pressable
          style={{ margin: 10, padding: 10, backgroundColor: "#c0191F" }} onPress={onDelete}
        >
          <Text style={{ color: "white", textAlign: "center" }}>DELETE</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
