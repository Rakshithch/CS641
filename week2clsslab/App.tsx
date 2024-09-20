import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, ActivityIndicator, ScrollView } from 'react-native';

export default function App() {
  return (
    <ScrollView>
      <Text>Yay!!</Text>
      <Text>Week2 Class Lab is DONE!!</Text>
      <ActivityIndicator></ActivityIndicator>
      <Image source={{uri: "https://www.pace.edu/sites/default/files/styles/16_9_1600x900/public/2022-04/provost-interior-hero.jpg?h=993b43e0&itok=DUs3eLCi"}}
      style={styles.tinyLogo} />
      <StatusBar style="auto" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tinyLogo: {
    width: 500,
    height: 500,
  },
});
