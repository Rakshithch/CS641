import React, { useEffect, useState } from "react";
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
} from "react-native";
import { useRouter } from "expo-router";
import { auth, db } from "../../firebaseConfig";
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  orderBy,
  getDoc,
  doc,
} from "firebase/firestore";

export default function ChatScreen() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [displayName, setDisplayName] = useState("Anonymous");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.replace("/(tabs)/login");
      } else {
        // Fetch the user profile
        const fetchUserProfile = async () => {
          try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              setDisplayName(userData.displayName || "Anonymous");
              setAvatarUrl(userData.avatarUrl || "");
            }
          } catch (error) {
            console.error("Error fetching user profile:", error);
          }
        };

        fetchUserProfile();
      }
    });

    const q = query(collection(db, "messages"), orderBy("timestamp", "asc"));
    const unsubscribeMessages = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(fetchedMessages);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeMessages();
    };
  }, [router]);

  const handleSend = async () => {
    if (message.trim() === "") return;

    try {
      const user = auth.currentUser;

      if (!user) {
        console.error("No user is logged in.");
        return;
      }

      // Add the message to Firestore
      await addDoc(collection(db, "messages"), {
        text: message,
        timestamp: new Date(),
        user: displayName,
        avatarUrl,
      });

      setMessage(""); // Clear input field
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push("/(tabs)/welcome")}
      >
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.messageContainer}>
            {item.avatarUrl ? (
              <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />
            ) : null}
            <View>
              <Text style={styles.user}>{item.user}</Text>
              <Text style={styles.message}>{item.text}</Text>
            </View>
          </View>
        )}
        contentContainerStyle={{ padding: 20 }}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="#aaa"
          value={message}
          onChangeText={setMessage}
        />
        <Button title="Send" onPress={handleSend} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  backButton: {
    padding: 10,
    backgroundColor: "#1E90FF",
    alignSelf: "flex-start",
    margin: 10,
    borderRadius: 5,
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#222",
    borderRadius: 5,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  user: {
    fontWeight: "bold",
    color: "#1E90FF",
    marginBottom: 5,
  },
  message: {
    color: "#fff",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#444",
  },
  input: {
    flex: 1,
    backgroundColor: "#222",
    color: "#fff",
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
  },
});
