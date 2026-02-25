import { View, Text, Button } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext } from "react";
import { NotesContext } from "../_layout";

export default function NoteDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { notes } = useContext(NotesContext);

  const note = notes.find((n: any) => n.id === id);

  if (!note) return <Text>Note not found</Text>;

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>{note.title}</Text>

      <Text style={{ marginTop: 20 }}>{note.content}</Text>

      <Button title="Back" onPress={() => router.back()} />
    </View>
  );
}
