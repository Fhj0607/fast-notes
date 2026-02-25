import { Stack } from "expo-router";
import { createContext, useState } from "react";

export const NotesContext = createContext<any>(null);

export default function RootLayout() {
  const [notes, setNotes] = useState<any[]>([]);

  return (
    <NotesContext.Provider value={{ notes, setNotes }}>
      <Stack />
    </NotesContext.Provider>
  );
}
