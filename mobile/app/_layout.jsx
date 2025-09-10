// // app/_layout.jsx

// import { Stack } from "expo-router";
// import * as SplashScreen from 'expo-splash-screen';
// import { useEffect } from 'react';

// // Import the useFonts hook and the specific fonts from the package
// import { useFonts, Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';

// // Keep the splash screen visible while we fetch resources
// SplashScreen.preventAutoHideAsync();

// export default function RootLayout() {
//   // Load fonts directly from the imported package
//   const [fontsLoaded] = useFonts({
//     'Poppins-Regular': Poppins_400Regular,
//     'Poppins-SemiBold': Poppins_600SemiBold,
//     'Poppins-Bold': Poppins_700Bold,
//   });

//   useEffect(() => {
//     if (fontsLoaded) {
//       // Hide the splash screen after the fonts have loaded
//       SplashScreen.hideAsync();
//     }
//   }, [fontsLoaded]);

//   if (!fontsLoaded) {
//     return null; // Return null while fonts are loading
//   }

//   return (
//     <Stack>
//       <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//       <Stack.Screen name="report-create" options={{ headerShown: false, presentation: "modal" }} />
//       <Stack.Screen name="my-reports/[id]" options={{ headerShown: false, presentation: "modal" }} />
//       <Stack.Screen name="community/[id]" options={{ headerShown: false, presentation: "modal" }} />
//     </Stack>
//   );
// }

// app/_layout.jsx

import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext"; // <-- 1. IMPORT THE PROVIDER

export default function RootLayout() {
  return (
    // 2. WRAP YOUR ENTIRE APP NAVIGATION WITH THE PROVIDER
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* The (tabs) layout and login screen will now be children of AuthProvider */}
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="login" /> 
        {/* Add signup screen here too if you have one */}
      </Stack>
    </AuthProvider>
  );
}