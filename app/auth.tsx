import { useState } from "react";
import { View, TextInput, Button } from "react-native";
import { supabase } from "../lib/supabase";
import { useRouter } from "expo-router";

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
      alert(error.message)
      return;
    }

    if (data.session) {
      router.replace("/");
    }
  };

  const signIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message)
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

      <Button title="Signup" onPress={signUp} />
      <Button title="Login" onPress={signIn} />
    </View>
  );
}
