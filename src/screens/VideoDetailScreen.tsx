import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import { useRoute } from "@react-navigation/native";
import { StackNavProps } from "../navigation/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const VideoDetailScreen = () => {
  const { params } = useRoute<StackNavProps<"VideoDetail">["route"]>();
  const video = params.video;

  return (
    <View style={styles.container}>
      <View style={styles.videoContainer}>
        <View style={styles.placeholder}>
          <MaterialCommunityIcons name="play-circle" size={80} color="#fff" />
          <Text style={styles.playText}>Video Preview</Text>
          <Text style={styles.videoInfo}>
            {video.videoUri ? "Media beschikbaar" : "Geen media"}
          </Text>
        </View>
      </View>
      
      <View style={styles.info}>
        <Text style={styles.title}>{video.title}</Text>
        <Text style={styles.username}>@{video.username}</Text>
        <Text style={styles.description}>{video.description}</Text>
        
        <View style={styles.stats}>
          <MaterialCommunityIcons name="heart" size={20} color="#e74c3c" />
          <Text style={styles.likes}>{video.likes} likes</Text>
        </View>
      </View>
    </View>
  );
};

export default VideoDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  videoContainer: {
    height: 300,
    backgroundColor: "#000",
  },
  placeholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  playText: {
    fontSize: 18,
    color: "#fff",
    marginTop: 12,
  },
  videoInfo: {
    fontSize: 12,
    color: "#ccc",
    marginTop: 4,
  },
  info: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    fontFamily: "DrippingMarker",
  },
  username: {
    fontSize: 16,
    color: "#666",
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  stats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  likes: {
    fontSize: 16,
    color: "#666",
  },
});
