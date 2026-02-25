import {
  View,
  TextInput,
  Button,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { supabase } from "../lib/supabase";

export default function Note() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const saveNote = async () => {
    if (!title.trim()) {
      Alert.alert("Title required");
      return;
    }

    const { error } = await supabase.from("notes").insert({
      title: title.trim(),
      content: content.trim(),
    });

    if (error) {
      Alert.alert("error", error.message);
      return;
    }

    router.replace("/");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, padding: 20 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
      />

      <TextInput
        placeholder="Write note..."
        value={content}
        onChangeText={setContent}
        multiline
        style={{ borderWidth: 1, padding: 10, height: 200, marginBottom: 20 }}
      />

      <Button title="Save" onPress={saveNote} />
    </KeyboardAvoidingView>
  );
}
