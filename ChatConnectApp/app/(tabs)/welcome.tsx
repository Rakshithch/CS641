import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { auth, db } from "../../firebaseConfig";
import { getDoc, doc } from "firebase/firestore";

export default function WelcomeScreen() {
  const router = useRouter();
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);

  useEffect(() => {
    const checkUserProfile = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (!userDoc.exists()) {
            router.replace("/(tabs)/profileSetup");
          }
        } else {
          router.replace("/(tabs)/login");
        }
      } catch (error) {
        console.error("Error checking user profile:", error);
      } finally {
        setIsCheckingProfile(false);
      }
    };

    checkUserProfile();
  }, [router]);

  if (isCheckingProfile) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E90FF" />
        <Text style={styles.loadingText}>Checking user profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to ChatConnect</Text>

      {/* Connect Chat Button */}
      <TouchableOpacity
        style={styles.connectChatButton}
        onPress={() => router.push("/(tabs)/chat")}
      >
        <Text style={styles.connectChatButtonText}>Connect Chat</Text>
      </TouchableOpacity>

      {/* Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.push("/(tabs)/chat")}
        >
          <Text style={styles.navButtonText}>Go to Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.push("/(tabs)/profileSetup")}
        >
          <Text style={styles.navButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  title: {
    fontSize: 24,
    color: "#fff",
    marginBottom: 20,
  },
  connectChatButton: {
    backgroundColor: "#1E90FF",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginTop: 20,
  },
  connectChatButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  loadingText: {
    color: "#fff",
    fontSize: 16,
    marginTop: 10,
  },
  navBar: {
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    backgroundColor: "#1E1E1E",
    paddingVertical: 10,
  },
  navButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
  },
  navButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
