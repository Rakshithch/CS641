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
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "expo-router"; 
import { auth, db } from "../../firebaseConfig";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter(); 
  const colorScheme = useColorScheme(); 

  const handleSignUp = async () => {
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Set display name for the user
      const displayName = email.split("@")[0]; 
      await updateProfile(user, { displayName });

      // Create Firestore document for the user
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        displayName,
        avatarUrl: "",
      });

      // Show success message and navigate to welcome screen
      Alert.alert("Registration Successful", "Welcome to ChatConnect!");
      router.replace("/(tabs)/welcome"); 
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
