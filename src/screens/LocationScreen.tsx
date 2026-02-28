import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import * as Location from "expo-location";

const LocationScreen = () => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const position = await Location.getCurrentPositionAsync({});
        setLocation(position);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>LocationScreen</Text>
      <Text>
        {location?.coords.latitude} {location?.coords.longitude}
      </Text>
    </View>
  );
};

export default LocationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    fontFamily: "DrippingMarker",
  },
});
