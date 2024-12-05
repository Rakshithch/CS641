import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  useColorScheme,
} from "react-native";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const auth = getAuth();
  const colorScheme = useColorScheme(); // Detect system theme

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Create Firestore document for the user
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        displayName: user.email.split("@")[0], // Use prefix of email
        avatarUrl: "",
      });

      navigation.navigate("welcome");
    } catch (error) {
      console.error("Error during sign-up:", error.message);
      Alert.alert("Sign-Up Failed", error.message);
    }
  };

  const themeStyles = colorScheme === "dark" ? darkTheme : lightTheme;

  return (
    <View style={[styles.container, themeStyles.container]}>
      <Text style={[styles.title, themeStyles.text]}>Register</Text>
      <TextInput
        style={[styles.input, themeStyles.input]}
        placeholder="Email"
        placeholderTextColor={themeStyles.placeholderTextColor}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={[styles.input, themeStyles.input]}
        placeholder="Password"
        placeholderTextColor={themeStyles.placeholderTextColor}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Sign Up" onPress={handleSignUp} color={themeStyles.buttonColor} />
    </View>
  );
}

const lightTheme = {
  container: { backgroundColor: "#fff" },
  text: { color: "#000" },
  input: { backgroundColor: "#f9f9f9", color: "#000", borderColor: "#ccc" },
  placeholderTextColor: "#666",
  buttonColor: "#1E90FF",
};

const darkTheme = {
  container: { backgroundColor: "#000" },
  text: { color: "#fff" },
  input: { backgroundColor: "#333", color: "#fff", borderColor: "#666" },
  placeholderTextColor: "#888",
  buttonColor: "#1E90FF",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: "80%",
    height: 50,
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
  },
});
