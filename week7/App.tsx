import { StatusBar } from 'expo-status-bar';
import {Button, StyleSheet, Text, View} from 'react-native';
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {NavigationContainer} from "@react-navigation/native";
import {createDrawerNavigator} from '@react-navigation/drawer';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function MyDrawer({}) {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Settings" component={Settings} />
      <Drawer.Screen name="Details" component={Details} />
    </Drawer.Navigator>
  );
}

function Home({navigation}) {
  return (
      <View style={styles.container}>
        <Text>This is home screen</Text>
          <Button title={"Settings"} onPress={() => navigation.navigate('Settings')}/>
          <Button title={"Go To Details"} onPress={() => navigation.navigate('Details')}/>
      </View>
  );
}

function Settings({navigation}) {
    return (
        <View style={styles.container}>
            <Text>This is settings screen</Text>
            <Button title={"Details"} onPress={() => navigation.navigate('Details')}/>
            <Button title={"Go Back"} onPress={() => navigation.goBack()}/>
        </View>
    );
}

function Details({navigation}) {
  return (
      <View style={styles.container}>
          <Text>This is details screen</Text>
          <Button title={"Settings"} onPress={() => navigation.navigate('Settings')}/>
          <Button title={"Go Back"} onPress={() => navigation.goBack()}/>
      </View>
  );
}

export default function App() {
  return (

      /*<NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={Home}/>
          <Stack.Screen name="Settings" component={Settings}/>
          <Stack.Screen name="Details" component={Details}/>
        </Stack.Navigator> 
      </NavigationContainer> */
          <NavigationContainer>
          <MyDrawer />
        </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
