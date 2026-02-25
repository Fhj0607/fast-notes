import {
  View,
  TextInput,
  Button,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState, useContext } from "react";
import { useRouter } from "expo-router";
import { NotesContext } from "./_layout";

export default function Note() {
  const router = useRouter();
  const { notes, setNotes } = useContext(NotesContext);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const saveNote = () => {
    const newNote = {
      id: Date.now().toString(),
      title,
      content,
    };

    setNotes([...notes, newNote]);
    router.replace("/");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, padding: 20 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
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
        style={{
          borderWidth: 1,
          padding: 10,
          height: 200,
          marginBottom: 20,
        }}
      />

      <Button title="Save" onPress={saveNote} />
    </KeyboardAvoidingView>
  );
}
