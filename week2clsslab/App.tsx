import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, ScrollView, Button } from 'react-native';

const CounterComponent = ({ initialCount }) => {
  const [count, setCount] = useState(initialCount);

  return (
    <View style={styles.component}>
      <Text>Count: {count}</Text>
      <Button title="Increase Count" onPress={() => setCount(count + 1)} />
    </View>
  );
};

const TextComponent = ({ initialText }) => {
  const [text, setText] = useState(initialText);

  return (
    <View style={styles.component}>
      <Text>{text}</Text>
      <Button title="Change Text" onPress={() => setText('Text Updated!')} />
    </View>
  );
};

export default function App() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text>Yay!!</Text>
      <Text>Week2 Class Lab is DONE!!</Text>
      <ActivityIndicator />
      <Image
        source={{
          uri: 'https://www.pace.edu/sites/default/files/styles/16_9_1600x900/public/2022-04/provost-interior-hero.jpg?h=993b43e0&itok=DUs3eLCi',
        }}
        style={styles.tinyLogo}
      />

      {}
      <CounterComponent initialCount={0} />

      {}
      <TextComponent initialText="Initial Text" />

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
  component: {
    marginVertical: 20,
    alignItems: 'stretch',
  },
});
