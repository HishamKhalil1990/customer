import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import LoginScreen from "./Screens/LoginScreen";
import InfoScreen from "./Screens/InfoScreen";
import * as ScreenOrientation from 'expo-screen-orientation';

const Stack = createStackNavigator();

export default function App() {

  const [orientation, setOrientation] = useState(null);

  useEffect(() => {
    const subscription = ScreenOrientation.addOrientationChangeListener(
      handleOrientationChange
    );
    changeScreenOrientation(ScreenOrientation.OrientationLock.PORTRAIT_DOWN)
    return () => {
      ScreenOrientation.removeOrientationChangeListeners(subscription);
    };
  },[])

  const handleOrientationChange = (o) => {
    setOrientation(o.orientationInfo.orientation);
  };

  async function changeScreenOrientation(orientation) {
    await ScreenOrientation.lockAsync(orientation);
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          headerTitleAlign: 'center',
          headerTitleStyle: {
            textAlign: 'center',
          },
          headerTintColor:'#fff',
          headerStyle:{
            backgroundColor:"#790252"
          }
        }}
      >
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
        />
        <Stack.Screen
          name="Info"
          options={{
            title:'المعلومات',
            headerShown: true,
            gestureDirection: "horizontal-inverted",
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
          component={InfoScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
