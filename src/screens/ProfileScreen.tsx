import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const ProfileScreen = () => {
  const user = auth.currentUser;
  const displayName = user?.displayName || "Gebruiker";
  const email = user?.email || "";
  const initial = displayName.charAt(0).toUpperCase();

  const handleLogout = () => {
    Alert.alert(
      "Uitloggen",
      "Weet je zeker dat je wilt uitloggen?",
      [
        { text: "Annuleren", style: "cancel" },
        { 
          text: "Uitloggen", 
          style: "destructive",
          onPress: async () => {
            try {
              await signOut(auth);
            } catch (error) {
              console.log("Uitloggen mislukt:", error);
              Alert.alert("Fout", "Uitloggen is mislukt. Probeer het later opnieuw.");
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileImageContainer}>
        <View style={styles.profileImage}>
          <Text style={styles.profileInitial}>{initial}</Text>
        </View>
      </View>
      
      <Text style={styles.username}>{displayName}</Text>
      <Text style={styles.email}>{email}</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}>
          <MaterialCommunityIcons name="logout" size={20} color="#fff" />
          <Text style={styles.buttonText}>Uitloggen</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 64,
    backgroundColor: "#f5f5f5",
  },
  profileImageContainer: {
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#4e88d9",
    justifyContent: "center",
    alignItems: "center",
  },
  profileInitial: {
    fontSize: 40,
    fontWeight: "bold",
    color: "white",
    fontFamily: "DrippingMarker",
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    fontFamily: "DrippingMarker",
  },
  email: {
    fontSize: 16,
    color: "#666",
    marginBottom: 32,
  },
  buttonContainer: {
    width: '80%',
    gap: 16,
  },
  logoutButton: {
    backgroundColor: "#e74c3c",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
