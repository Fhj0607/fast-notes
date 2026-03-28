import * as Notifications from "expo-notifications";
import { Stack, useRouter, useSegments } from "expo-router";
import { createContext, useEffect, useState } from "react";
import { ActivityIndicator, Platform, View } from "react-native";
import { supabase } from "../lib/supabase";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export const NotesContext = createContext<any>(null);

export default function RootLayout() {
  const [notes, setNotes] = useState<any[]>([]);
  const [session, setSession] = useState<any>(undefined);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const setupNotifications = async () => {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();

      if (existingStatus !== "granted") {
        await Notifications.requestPermissionsAsync();
      }

      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.DEFAULT,
        });
      }
    };

    setupNotifications();
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (!isMounted) return;
      setSession(data.session ?? null);
    };

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession ?? null);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (session === undefined) return;

    const inAuthScreen = segments[0] === "auth";

    if (!session && !inAuthScreen) {
      router.replace("/auth");
      return;
    }

    if (session && inAuthScreen) {
      router.replace("/");
    }
  }, [router, segments, session]);

  if (session === undefined) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NotesContext.Provider value={{ notes, setNotes }}>
      <Stack screenOptions={{ headerShown: false }} />
    </NotesContext.Provider>
  );
}
