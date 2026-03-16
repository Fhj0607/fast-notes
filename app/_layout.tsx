import * as Notifications from "expo-notifications";
import { Stack } from "expo-router";
import { createContext, useEffect, useState } from "react";
import { Platform } from "react-native";

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

  useEffect(() => {
    const setupNotifications = async () => {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();

      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.DEFAULT,
        });
      }

      console.log("Notification permission:", finalStatus);
    };

    setupNotifications();
  }, []);

  return (
    <NotesContext.Provider value={{ notes, setNotes }}>
      <Stack />
    </NotesContext.Provider>
  );
}
