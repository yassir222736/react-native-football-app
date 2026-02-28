import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { createStackNavigator, StackHeaderProps } from "@react-navigation/stack";
import { StackNavigatorParamsList, StackNavProps } from "./types";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import HomeScreen from "../screens/HomeScreen";
import VideoDetailScreen from "../screens/VideoDetailScreen";
import UploadScreen from "../screens/UploadScreen";

const Stack = createStackNavigator<StackNavigatorParamsList>();

const StackNavigator = () => {
  const navigation = useNavigation<StackNavProps<"Home">["navigation"]>();

  const handlePress = () => {
    navigation.navigate("Upload");
  };

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#4e88d9" },
        headerTintColor: "white",
        headerTitleStyle: { fontSize: 24 },
      }}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Video Feed",
          headerRight: ({ tintColor }) => {
            return (
              <TouchableOpacity
                style={{ marginRight: 8 }}
                onPress={handlePress}>
                <MaterialCommunityIcons
                  color={tintColor}
                  size={28}
                  name="plus"
                />
              </TouchableOpacity>
            );
          },
        }}
      />
      <Stack.Screen
        name="VideoDetail"
        component={VideoDetailScreen}
        options={{
          title: "Video Details"
        }}
      />
      <Stack.Screen 
        name="Upload" 
        component={UploadScreen} 
        options={{
          title: "Upload Video"
        }}
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;
