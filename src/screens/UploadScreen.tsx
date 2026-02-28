import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Button,
  Alert,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useFormik } from "formik";
import * as Yup from "yup";
import { auth } from "../config/firebase";
import { useNavigation } from "@react-navigation/native";
import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Titel is verplicht"),
  description: Yup.string().required("Beschrijving is verplicht"),
});

const UploadScreen = () => {
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const navigation = useNavigation();
  const user = auth.currentUser;

  const {
    values,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useFormik({
    initialValues: {
      title: "",
      description: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!selectedMedia) {
        Alert.alert("Fout", "Selecteer eerst een video/afbeelding");
        return;
      }

      if (!user) {
        Alert.alert("Fout", "Je moet ingelogd zijn om te uploaden");
        return;
      }

      try {
        const videosCollectionRef = collection(db, "videos");
        await addDoc(videosCollectionRef, {
          title: values.title,
          description: values.description,
          username: user.displayName || "Onbekend",
          userId: user.uid,
          videoUri: selectedMedia,
          likes: 0,
          createdAt: serverTimestamp(),
        });

        Alert.alert("Succes", "Video geüpload!", [
          { text: "OK", onPress: () => navigation.goBack() }
        ]);
      } catch (error) {
        console.log(error);
        Alert.alert("Fout", "Upload mislukt");
      }
    },
  });

  const pickMedia = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert("Fout", "Toegang tot galerij is vereist!");
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images', 'videos'],
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      console.log("ImagePicker result:", result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setSelectedMedia(asset.uri);
        setMediaType(asset.type);
        console.log("Selected media:", asset.uri, "Type:", asset.type);
      }
    } catch (error) {
      console.log("ImagePicker error:", error);
      Alert.alert("Fout", "Kon media niet selecteren");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Upload je skills</Text>
      
      <TouchableOpacity style={styles.optionButton} onPress={pickMedia}>
        <View style={styles.optionIcon}>
          <MaterialCommunityIcons name="image" size={40} color="#666" />
        </View>
        <Text style={styles.optionText}>Kies uit Galerij</Text>
      </TouchableOpacity>
      
      {selectedMedia && (
        <View style={styles.previewContainer}>
          <Text style={styles.previewTitle}>Geselecteerde media:</Text>
          {mediaType === 'image' ? (
            <Image 
              source={{ uri: selectedMedia }} 
              style={styles.imagePreview}
            />
          ) : (
            <View style={styles.videoPreview}>
              <MaterialCommunityIcons name="play-circle" size={60} color="#666" />
              <Text style={styles.videoText}>Video geselecteerd</Text>
              <Text style={styles.videoPath}>{selectedMedia.split('/').pop()}</Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.formContainer}>
        <Text style={styles.label}>Titel</Text>
        <TextInput
          style={styles.input}
          placeholder="Geef je video een titel"
          value={values.title}
          onChangeText={handleChange("title")}
          onBlur={handleBlur("title")}
        />
        {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}

        <Text style={styles.label}>Beschrijving</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Beschrijf je skills"
          value={values.description}
          onChangeText={handleChange("description")}
          onBlur={handleBlur("description")}
          multiline
          numberOfLines={4}
        />
        {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}

        <Button 
          title="Upload Video" 
          onPress={() => handleSubmit()}
        />
      </View>
    </ScrollView>
  );
};

export default UploadScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 32,
    fontFamily: "DrippingMarker",
    textAlign: "center",
  },
  optionButton: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 20,
  },
  optionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  optionText: {
    fontSize: 16,
    fontWeight: "500",
  },
  previewContainer: {
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  imagePreview: {
    width: 300,
    height: 200,
    borderRadius: 8,
  },
  videoPreview: {
    width: 300,
    height: 200,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  videoText: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
  },
  videoPath: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    textAlign: "center",
  },
  formContainer: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: -12,
    marginBottom: 8,
  },
});
