import {
  Button,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth";
import { auth } from "../config/firebase";

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Geen geldig email.").required(),
  password: Yup.string().required(),
});

const RegisterScreen = () => {
  const navigation = useNavigation();

  const {
    values,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      try {
        const user = await createUserWithEmailAndPassword(
          auth,
          values.email,
          values.password
        );
        
        await updateProfile(user.user, {
          displayName: values.name,
        });
        
        await signOut(auth);
        
        Alert.alert(
          "Registratie geslaagd!", 
          "Je kunt nu inloggen met je account.",
          [
            { 
              text: "OK", 
              onPress: () => navigation.navigate("Login") 
            }
          ]
        );
        
      } catch (error) {
        console.log("Registratie fout:", error.message);
        Alert.alert("Fout", "Registratie mislukt");
      }
    },
    validationSchema,
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>RegisterScreen</Text>
      <TextInput
        value={values.name}
        onChangeText={handleChange("name")}
        onBlur={handleBlur("name")}
        placeholder="Naam"
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="next"
        autoComplete={Platform.OS === "ios" ? "name" : "address-line1"}
        style={styles.input}
      />
      <TextInput
        value={values.email}
        onChangeText={handleChange("email")}
        onBlur={handleBlur("email")}
        placeholder="Email"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        returnKeyType="next"
        autoComplete={Platform.OS === "ios" ? "email" : "address-line1"}
        style={styles.input}
      />
      {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
      <TextInput
        placeholder="Wachtwoord"
        secureTextEntry
        autoComplete="password"
        value={values.password}
        onBlur={handleBlur("email")}
        onChangeText={(text) => {
          setFieldValue("password", text);
        }}
        style={styles.input}
      />
      <Button title="Registreren" onPress={() => handleSubmit()} />
      
      <Text 
        style={styles.loginLink}
        onPress={() => navigation.navigate("Login")}>
        Heb je al een account? Log hier in
      </Text>
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "white",
    padding: 20,
    gap: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "DrippingMarker",
    color: "#4e88d9",
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  errorText: {
    color: "red",
    marginBottom: 8,
  },
  loginLink: {
    color: "#4e88d9",
    textAlign: "center",
    marginTop: 20,
  }
});
