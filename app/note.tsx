import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { supabase } from "../lib/supabase";

export default function Note() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const saveNote = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert("Title or content missing...");
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

    Alert.alert("Success!", "Your note was uploaded.", [
      {
        text: "OK",
        onPress: () => router.replace("/"),
      },
    ]);
  };

  const takePhoto = () => {
    return;
  };
  const pickImage = () => {
    return;
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <ScrollView
        contentContainerStyle={{ padding: 20, flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        alwaysBounceVertical={false}
      >
        <TextInput
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
          style={{
            borderWidth: 1,
            marginBottom: 10,
            padding: 10,
            borderRadius: 8,
          }}
        />

        <TextInput
          placeholder="Write note..."
          value={content}
          onChangeText={setContent}
          multiline
          style={{
            borderWidth: 1,
            padding: 10,
            height: 120,
            marginBottom: 20,
            borderRadius: 8,
          }}
        />

        {/* --- Image Preview Section --- */}
        {imageUri ? (
          <View style={{ alignItems: "center", marginBottom: 20 }}>
            <Image
              source={{ uri: imageUri }}
              style={{ width: "100%", height: 200, borderRadius: 10 }}
              resizeMode="cover"
            />
            <Pressable onPress={() => setImageUri(null)}>
              <Text style={{ color: "red", marginTop: 5 }}>Remove Image</Text>
            </Pressable>
          </View>
        ) : (
          <View
            style={{
              height: 100,
              borderStyle: "dashed",
              borderWidth: 1,
              justifyContent: "center",
              marginBottom: 20,
            }}
          >
            <Text style={{ textAlign: "center", color: "#aaa" }}>
              No image selected
            </Text>
          </View>
        )}

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Pressable style={styles.blueBtnSmall} onPress={takePhoto}>
            <Text style={styles.btnText}>Take Photo</Text>
          </Pressable>
          <Pressable style={styles.blueBtnSmall} onPress={pickImage}>
            <Text style={styles.btnText}>Pick Image</Text>
          </Pressable>
        </View>

        {/* Spacer */}
        <View style={{ flex: 1 }} />

        <Pressable style={styles.blueBtn} onPress={saveNote}>
          <Text style={styles.btnText}>SAVE NOTE</Text>
        </Pressable>

        <Pressable
          style={[styles.blueBtn, { backgroundColor: "#666" }]}
          onPress={() => router.back()}
        >
          <Text style={styles.btnText}>BACK</Text>
        </Pressable>
      </ScrollView>
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
