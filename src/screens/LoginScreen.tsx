import {
  Button,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { useFormik } from "formik";
import * as Yup from "yup";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Geen geldig email.").required(),
  password: Yup.string().required(),
});

const LoginScreen = () => {
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
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await signInWithEmailAndPassword(auth, values.email, values.password);
        console.log("Login geslaagd");
      } catch (error) {
        console.log("Login fout:", error.message);
      }
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>StreetFootballLegends</Text>
      <Text style={styles.subtitle}>Login om verder te gaan</Text>
      
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
      
      <Button title="Login" onPress={() => handleSubmit()} />
      
      <Text 
        style={styles.registerLink}
        onPress={() => navigation.navigate("Register")}>
        Nog geen account? Registreer hier
      </Text>
    </View>
  );
};

export default LoginScreen;

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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
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
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
  },
  registerLink: {
    color: "#4e88d9",
    textAlign: "center",
    marginTop: 20,
  }
});
