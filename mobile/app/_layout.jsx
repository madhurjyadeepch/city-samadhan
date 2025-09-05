// app/_layout.jsx

import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      {/* The main tab navigator */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      {/* The screen for creating a new report, presented as a modal */}
      <Stack.Screen
        name="report-create"
        options={{
          headerShown: false,
          presentation: "modal",
        }}
      />

      {/* Screen for viewing the details of a user's own report */}
      <Stack.Screen
        name="my-reports/[id]"
        options={{
          headerShown: false,
          presentation: "modal",
        }}
      />

      {/* Screen for viewing the details of a community report */}
      <Stack.Screen
        name="community/[id]"
        options={{
          headerShown: false,
          presentation: "modal",
        }}
      />
    </Stack>
  );
}