import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from "./screens/HomeScreen";
import SettingsScreen from "./screens/SettingsScreen";
import React, { useContext } from "react";
import BoulderMap from "./screens/BoulderMap";
import Feather from '@expo/vector-icons/Feather';
import Entypo from '@expo/vector-icons/Entypo';
import { DarkModeProvider, DarkModeContext } from "./providers/DarkModeProvider";

const Tab = createBottomTabNavigator();

export default function App() {
    return (
        <DarkModeProvider>
            <AppNavigator />
        </DarkModeProvider>
    );
}
function AppNavigator() {
    const { darkMode } = useContext(DarkModeContext);

    return (
        <NavigationContainer theme={darkMode ? DarkTheme : DefaultTheme}>
            <Tab.Navigator
                initialRouteName="Home"
                screenOptions={{
                    headerStyle: { backgroundColor: darkMode ? '#333' : 'tomato' },
                    tabBarStyle: { backgroundColor: darkMode ? '#333' : '#fff' },
                    tabBarActiveTintColor: darkMode ? '#fff' : '#000',
                }}>
                <Tab.Screen
                    name="Map"
                    component={BoulderMap}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <Feather name="map" size={size} color={color} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <Entypo name="home" size={size} color={color} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Settings"
                    component={SettingsScreen}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <Feather name="settings" size={size} color={color} />
                        ),
                    }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
}