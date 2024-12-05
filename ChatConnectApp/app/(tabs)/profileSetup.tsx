import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { auth, db } from "../../firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function ProfileSetupScreen() {
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const user = auth.currentUser;

        if (user) {
          setEmail(user.email || "No Email Available");
          const userDoc = await getDoc(doc(db, "users", user.uid));

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setDisplayName(userData.displayName || "");
            setAvatarUrl(userData.avatarUrl || "");
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleSaveProfile = async () => {
    if (!displayName.trim()) {
      Alert.alert("Error", "Display Name is required.");
      return;
    }

    try {
      const user = auth.currentUser;

      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, {
          displayName,
          avatarUrl,
          email: user.email,
        });
        Alert.alert("Profile Saved", "Your profile has been updated.");
        router.replace("/(tabs)/welcome");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      Alert.alert("Error", "Failed to save profile.");
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.replace("/(tabs)/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push("/(tabs)/welcome")}
      >
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Setup Your Profile</Text>
      <Text style={styles.emailText}>Logged in as: {email}</Text>

      <TextInput
        style={styles.input}
        placeholder="Display Name"
        placeholderTextColor="#aaa"
        value={displayName}
        onChangeText={setDisplayName}
      />
      <TextInput
        style={styles.input}
        placeholder="Avatar URL (optional)"
        placeholderTextColor="#aaa"
        value={avatarUrl}
        onChangeText={setAvatarUrl}
      />
      <Button title="Save Profile" onPress={handleSaveProfile} color="#1E90FF" />
      <View style={{ marginVertical: 10 }} />
      <Button title="Logout" onPress={handleLogout} color="#FF6347" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#000",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    backgroundColor: "#1E90FF",
    padding: 10,
    borderRadius: 5,
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  title: {
    fontSize: 24,
    color: "#fff",
    marginBottom: 20,
  },
  emailText: {
    fontSize: 16,
    color: "#aaa",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    backgroundColor: "#222",
    color: "#fff",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
});
