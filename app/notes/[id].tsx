import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { supabase } from "../../lib/supabase";

type Notes = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string | null;
  user_id: string;
};

export default function NoteDetail() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const [note, setNote] = useState<Notes | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    if (!id) return;

    const loadNote = async () => {
      const { data, error } = await supabase
        .from("notes")
        .select(
          `
          id,user_id,title,content,created_at,updated_at
        `,
        )
        .eq("id", id)
        .returns<Notes>()
        .maybeSingle();

      if (error) {
        Alert.alert("Failed to load note.", error.message);
        return;
      }

      setNote(data);
    };

    loadNote();
  }, [id]);

  useEffect(() => {
    if (note) {
      setDraft(note.content ?? "");
    }
  }, [note]);

  if (!note || !id) return null;

  const onSave = async () => {
    if (!id) return;
    if (!note) return;
    const { data, error } = await supabase
      .from("notes")
      .update({ content: draft })
      .eq("id", note.id)
      .select(
        `
        id,user_id,title,content,created_at,updated_at
    `,
      )
      .returns<Notes>()
      .single();
    if (error) {
      Alert.alert("Failed to save note.", error.message);
      return;
    }
    setNote(data);
    setIsEditing(false);
  };

  const onDelete = () => {
    if (!id) return;
    if (!note) return;

    Alert.alert(
      "Please confirm",
      "Are you sure you want to delete this note?",
      [
        {
          text: "DELETE",
          style: "destructive",
          onPress: async () => {
            const { error } = await supabase
              .from("notes")
              .delete()
              .eq("id", note.id);

            if (error) {
              Alert.alert("Delete failed", error.message);
              return;
            }

            Alert.alert("Success!", "Your note was deleted.", [
              {
                text: "OK",
                onPress: () => router.replace("/"),
              },
            ]);
          },
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
    );
  };

  const onCancel = () => {
    if (!id) return;
    if (!note) return;

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

      <Text style={{ textAlign: "right", marginTop: 5 }}>
        Last edited:{" "}
        {note?.updated_at
          ? new Date(note.updated_at).toLocaleString()
          : "Not edited"}{" "}
      </Text>
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
          style={{ margin: 10, padding: 10, backgroundColor: "#c0191F" }}
          onPress={onDelete}
        >
          <Text style={{ color: "white", textAlign: "center" }}>DELETE</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
