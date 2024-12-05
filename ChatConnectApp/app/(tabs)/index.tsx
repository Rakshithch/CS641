import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to ChatConnect</Text>
      <Button title="Go to Chat" onPress={() => router.push("/chat")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000", // Explicitly set background color for dark mode
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: "#fff", // Set text color to white for visibility in dark mode
  },
});
