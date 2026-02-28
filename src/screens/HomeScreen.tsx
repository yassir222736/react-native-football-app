import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { StackNavProps } from "../navigation/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  Unsubscribe,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { useAppSelector, useAppDispatch } from "../hooks/redux";
import { addFavorite, removeFavorite } from "../store/favorites/slice";

interface Video {
  id: string;
  title: string;
  description: string;
  username: string;
  userId: string;
  videoUri: string;
  likes: number;
  createdAt: any;
}

const HomeScreen = () => {
  const navigation = useNavigation<StackNavProps<"Home">["navigation"]>();
  const isFocused = useIsFocused();
  const [videos, setVideos] = useState<Video[]>([]);
  const favorites = useAppSelector((state) => state.favorites);
  const dispatch = useAppDispatch();

  useEffect(() => {
    let unsubscribe: Unsubscribe;

    if (isFocused) {
      (async () => {
        try {
          const q = query(
            collection(db, "videos"),
            orderBy("createdAt", "desc")
          );

          unsubscribe = onSnapshot(q, (querySnapshot) => {
            setVideos(
              querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              } as Video))
            );
          });
        } catch (error) {
          console.log(error);
        }
      })();
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [isFocused]);

  const handleLike = async (video: Video) => {
    try {
      const videoRef = doc(db, "videos", video.id);
      await updateDoc(videoRef, {
        likes: video.likes + 1,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleFavorite = (video: Video) => {
    const isFavorite = favorites.some(fav => fav.id === video.id);
    if (isFavorite) {
      dispatch(removeFavorite(video.id));
    } else {
      dispatch(addFavorite(video));
    }
  };

  const renderVideo = ({ item }: { item: Video }) => (
    <TouchableOpacity
      style={styles.videoItem}
      onPress={() => navigation.navigate("VideoDetail", { video: item })}>
      
      <View style={styles.videoPreview}>
        <MaterialCommunityIcons name="play-circle" size={60} color="#666" />
        <Text style={styles.videoLabel}>Video Preview</Text>
      </View>
      
      <View style={styles.videoInfo}>
        <Text style={styles.videoTitle}>{item.title}</Text>
        <Text style={styles.videoUser}>@{item.username}</Text>
        <Text style={styles.videoDescription} numberOfLines={2}>
          {item.description}
        </Text>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.likeButton}
            onPress={() => handleLike(item)}>
            <MaterialCommunityIcons name="heart" size={20} color="#e74c3c" />
            <Text style={styles.videoLikes}>{item.likes}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.favoriteButton}
            onPress={() => handleFavorite(item)}>
            <MaterialCommunityIcons 
              name={favorites.some(fav => fav.id === item.id) ? "star" : "star-outline"} 
              size={20} 
              color={favorites.some(fav => fav.id === item.id) ? "#f39c12" : "#666"} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Video Feed</Text>
      
      <FlatList
        data={videos}
        keyExtractor={(item) => item.id}
        renderItem={renderVideo}
        style={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Nog geen video's. Upload de eerste!
            </Text>
          </View>
        }
      />
      
      <TouchableOpacity
        style={styles.uploadButton}
        onPress={() => navigation.navigate("Upload")}>
        <MaterialCommunityIcons name="plus" size={24} color="white" />
        <Text style={styles.uploadButtonText}>Upload Video</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    fontFamily: "DrippingMarker",
  },
  list: {
    flex: 1,
  },
  videoItem: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  videoPreview: {
    height: 200,
    backgroundColor: "#e0e0e0",
    borderRadius: 12,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  videoLabel: {
    fontSize: 16,
    color: "#666",
    marginTop: 8,
  },
  videoInfo: {
    padding: 12,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  videoUser: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  videoDescription: {
    fontSize: 14,
    color: "#333",
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  favoriteButton: {
    padding: 4,
  },
  videoLikes: {
    fontSize: 14,
    color: "#666",
  },
  uploadButton: {
    backgroundColor: "#4e88d9",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    gap: 8,
  },
  uploadButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});
