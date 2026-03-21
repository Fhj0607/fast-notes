import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { supabase } from "../lib/supabase";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const signUp = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      Alert.alert(error.message);
      return;
    }

    Alert.alert("Check your email to confirm your account.");
  };

  const signIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    router.replace("/");
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput placeholder="email" value={email} onChangeText={setEmail} />

      <TextInput
        placeholder="password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Pressable
        style={{ margin: 10, padding: 10, backgroundColor: "#1E90FF" }}
        onPress={signUp}
      >
        <Text style={{ color: "white", textAlign: "center" }}>Sign-up</Text>
      </Pressable>
      <Pressable
        style={{ margin: 10, padding: 10, backgroundColor: "#1E90FF" }}
        onPress={signIn}
      >
        <Text style={{ color: "white", textAlign: "center" }}>Sign-in</Text>
      </Pressable>
    </View>
  );
}
