import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { auth, db, storage } from "../../firebaseConfig";
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  orderBy,
  doc,
} from "firebase/firestore";
import uploadImage from "../../utils/uploadImage";

export default function ChatScreen() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [displayName, setDisplayName] = useState("Anonymous");
  const [avatarUrl, setAvatarUrl] = useState("");
  const flatListRef = useRef(null);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.replace("/(tabs)/login");
      } else {
        const userDocRef = doc(db, "users", user.uid);

        // Listen to real-time updates from Firestore for user profile
        const unsubscribeUserDoc = onSnapshot(userDocRef, (docSnapshot) => {
          if (docSnapshot.exists()) {
            const userData = docSnapshot.data();
            setDisplayName(userData.displayName || "Anonymous");
            setAvatarUrl(userData.avatarUrl || "");
          }
        });

        return unsubscribeUserDoc; // Cleanup listener when component unmounts
      }
    });

    const q = query(collection(db, "messages"), orderBy("timestamp", "asc"));
    const unsubscribeMessages = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(fetchedMessages);

      setTimeout(() => {
        if (flatListRef.current) {
          flatListRef.current.scrollToEnd({ animated: true });
        }
      }, 100);
    });

    return () => {
      unsubscribeAuth(); // Cleanup auth listener
      unsubscribeMessages(); // Cleanup Firestore listener for messages
    };
  }, [router]);

  const handleSend = async (mediaUrl = "") => {
    if (message.trim() === "" && !mediaUrl) {
      Alert.alert("Error", "Cannot send an empty message or media.");
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("No user is logged in.");
      }

      const messageData = {
        text: message.trim(),
        mediaUrl,
        timestamp: new Date(),
        user: displayName,
        avatarUrl,
      };

      await addDoc(collection(db, "messages"), messageData);
      setMessage(""); // Clear input field
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const pickMedia = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        const mediaUrl = await uploadImage({
          imageUri: result.assets[0].uri,
          storage,
          userId: auth.currentUser.uid,
        });
        if (mediaUrl) {
          await handleSend(mediaUrl); // Send the selected media
        }
      }
    } catch (error) {
      console.error("Error picking media:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push("/(tabs)/welcome")}
      >
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.messageContainer}>
            {item.avatarUrl ? (
              <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />
            ) : null}
            <View>
              <Text style={styles.user}>{item.user}</Text>
              {item.text ? <Text style={styles.message}>{item.text}</Text> : null}
              {item.mediaUrl ? (
                <Image source={{ uri: item.mediaUrl }} style={styles.media} />
              ) : null}
            </View>
          </View>
        )}
        contentContainerStyle={{ padding: 20 }}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        keyboardShouldPersistTaps="handled"
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="#aaa"
          value={message}
          onChangeText={setMessage}
        />
        <Button title="Send" onPress={() => handleSend()} />
        <TouchableOpacity style={styles.mediaButton} onPress={pickMedia}>
          <Text style={styles.mediaButtonText}>+ Media</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  backButton: { padding: 10, backgroundColor: "#1E90FF", alignSelf: "flex-start", margin: 10, borderRadius: 5 },
  backButtonText: { color: "#fff", fontWeight: "bold" },
  messageContainer: { flexDirection: "row", alignItems: "center", marginBottom: 10, padding: 10, backgroundColor: "#222", borderRadius: 5 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  user: { fontWeight: "bold", color: "#1E90FF", marginBottom: 5 },
  message: { color: "#fff" },
  media: { width: 200, height: 200, borderRadius: 10, marginTop: 10 },
  inputContainer: { flexDirection: "row", alignItems: "center", padding: 10, borderTopWidth: 1, borderColor: "#444" },
  input: { flex: 1, backgroundColor: "#222", color: "#fff", padding: 10, marginRight: 10, borderRadius: 5 },
  mediaButton: { backgroundColor: "#32CD32", padding: 10, borderRadius: 5 },
  mediaButtonText: { color: "#fff", fontWeight: "bold" },
});
