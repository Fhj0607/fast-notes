import { File } from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import * as Notifications from "expo-notifications";
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
      Alert.alert("Please enter both a title and content.");
      return;
    }

    try {
      setUploading(true);

      let imageUrl: string | null = null;

      if (imageUri) {
        imageUrl = await uploadImage(imageUri!);
      }

      const { error } = await supabase.from("notes").insert({
        title: title.trim(),
        content: content.trim(),
        image_url: imageUrl,
      });

      if (error) throw error;

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Note saved",
          body: `"${title.trim()}" was saved.`,
        },
        trigger: null,
      });

      Alert.alert("Success!", "Your note was saved.", [
        { text: "OK", onPress: () => router.replace("/") },
      ]);
    } catch (err: any) {
      Alert.alert("Failed to save note", err.message);
    } finally {
      setUploading(false);
    }
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync(); // (5%) Permissions

    if (!permission.granted) {
      Alert.alert("Camera permission required.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync(); // (5%) Permissions

    if (!permission.granted) {
      Alert.alert("Gallery permission required.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri: string): Promise<string | null> => {
    const MAX_SIZE = 15 * 1024 * 1024;

    const file = new File(uri);
    const info = file.info();

    if (!info.exists) {
      return null;
    }

    // (10%) Client-side Validation: Checks size and format before uploading.

    const size = info.size ?? 0;

    if (size > MAX_SIZE) {
      throw new Error("Image must be under 15MB");
    }

    const fileType = uri.split(".").pop()?.toLowerCase();
    if (!["jpg", "jpeg", "png", "webp"].includes(fileType || "")) {
      throw new Error("Invalid image format");
    }

    const response = await fetch(uri);
    const arrayBuffer = await response.arrayBuffer();

    const fileName = `${Date.now()}.${fileType}`;

    const { error } = await supabase.storage
      .from("note-images")
      .upload(fileName, arrayBuffer, {
        contentType: `image/${fileType}`,
      });

    if (error) throw error;

    const { data } = supabase.storage
      .from("note-images")
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, padding: 20, paddingBottom: 40 }}
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

        {imageUri && (
          <View style={{ alignItems: "center", marginBottom: 20 }}>
            <Image
              source={{ uri: imageUri }}
              style={{ width: "100%", height: 200, borderRadius: 10 }}
              resizeMode="cover"
            />
            <Pressable
              onPress={() => setImageUri(null)}
              style={{ marginTop: 8 }}
            >
              <Text style={{ color: "red", fontWeight: "600" }}>
                Remove Image
              </Text>
            </Pressable>
          </View>
        )}

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <Pressable style={styles.blueBtnSmall} onPress={takePhoto}>
            <Text style={styles.btnText}>
              {imageUri ? "Retake Photo" : "Take Photo"}
            </Text>
          </Pressable>

          <Pressable style={styles.blueBtnSmall} onPress={pickImage}>
            <Text style={styles.btnText}>
              {imageUri ? "Change Image" : "Pick Image"}
            </Text>
          </Pressable>
        </View>

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
