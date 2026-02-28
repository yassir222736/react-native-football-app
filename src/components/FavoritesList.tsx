import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { useAppSelector, useAppDispatch } from "../hooks/redux";
import { removeFavorite } from "../store/favorites/slice";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { VideoItem } from "../navigation/types";

const FavoritesList = () => {
  const favorites = useAppSelector((state) => state.favorites);
  const dispatch = useAppDispatch();

  const handleRemoveFavorite = (videoId: string) => {
    dispatch(removeFavorite(videoId));
  };

  const renderFavorite = ({ item }: { item: VideoItem }) => (
    <View style={styles.favoriteItem}>
      <View style={styles.videoInfo}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.username}>@{item.username}</Text>
        <Text style={styles.likes}>{item.likes} likes</Text>
      </View>
      
      <TouchableOpacity
        onPress={() => handleRemoveFavorite(item.id)}
        style={styles.removeButton}>
        <MaterialCommunityIcons name="heart-remove" size={24} color="#e74c3c" />
      </TouchableOpacity>
    </View>
  );

  if (favorites.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialCommunityIcons name="heart-outline" size={48} color="#666" />
        <Text style={styles.emptyText}>Nog geen favoriete video's</Text>
        <Text style={styles.emptySubtext}>Like video's om ze hier te zien!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Mijn Favorieten ({favorites.length})</Text>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={renderFavorite}
        style={styles.list}
      />
    </View>
  );
};

export default FavoritesList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    fontFamily: "DrippingMarker",
  },
  list: {
    flex: 1,
  },
  favoriteItem: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  videoInfo: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  username: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  likes: {
    fontSize: 12,
    color: "#e74c3c",
  },
  removeButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#666",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
  },
});
