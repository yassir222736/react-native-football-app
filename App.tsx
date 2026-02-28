import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import TabNavigator from "./src/navigation/TabNavigator";
import { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { Provider } from "react-redux";
import { persistedStore, store } from "./src/store/store";
import { PersistGate } from "redux-persist/integration/react";
import AuthStackNavigator from "./src/navigation/AuthStackNavigator";
import { auth } from "./src/config/firebase";
import { onAuthStateChanged, Unsubscribe } from "firebase/auth";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  
  const [isFontLoaded, fontError] = useFonts({
    "DrippingMarker": require("./assets/fonts/ADrippingMarker-Ddw1.ttf"),
  });

  useEffect(() => {
    let unsubscribe: Unsubscribe;
    if (isFontLoaded || fontError) {
      unsubscribe = onAuthStateChanged(auth, async (user) => {
        console.log("Auth status:", user ? "Ingelogd" : "Uitgelogd");
        setIsLoggedIn(user !== null);
        SplashScreen.hideAsync().catch(() => {});
      });
    }
    
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [isFontLoaded, fontError]);

  if (!isFontLoaded && !fontError) {
    return null;
  }

  if (isLoggedIn === null) {
    return null;
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistedStore}>
        <NavigationContainer>
          {isLoggedIn ? <TabNavigator /> : <AuthStackNavigator />}
          <StatusBar style="auto" />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
