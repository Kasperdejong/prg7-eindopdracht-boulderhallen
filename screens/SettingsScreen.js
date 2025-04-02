import {View, Text, TextInput, SafeAreaView, StyleSheet, Pressable, Switch} from "react-native";
import React, {useState, useEffect, useContext} from "react";
import {useNavigation} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {DarkModeContext} from "../providers/DarkModeProvider";


export default function SettingsScreen() {
    const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
    const navigation = useNavigation();
    const [name, setName] = useState("");
    const [number, setNumber] = useState("");

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const savedName = await AsyncStorage.getItem("name");
                const savedNumber = await AsyncStorage.getItem("number");

                if (savedName) setName(savedName);
                if (savedNumber) setNumber(savedNumber);
            } catch (error) {
                console.error("Fout bij het ophalen van instellingen:", error);
            }
        };
        loadSettings();
    }, []);

    // Gegevens opslaan in AsyncStorage
    const saveSettings = async () => {
        try {
            await AsyncStorage.setItem("name", name);
            await AsyncStorage.setItem("number", number);
            const leeftijd = parseInt(number, 0);
            if (leeftijd > 50) {
                alert("Je bent oud!");
            } else {
                alert("Je bent jong en fris!");
            }

            console.log("Instellingen opgeslagen!");
            navigation.navigate("Home");
        } catch (error) {
            console.error("Fout bij opslaan van instellingen:", error);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: darkMode ? '#333' : '#f7f7f7' }]}>
            <Text style={[styles.label, { color: darkMode ? '#fff' : '#000' }]}>Naam:</Text>
            <TextInput
                style={[styles.input, { color: darkMode ? '#fff' : '#000', borderColor: darkMode ? '#fff' : 'gray' }]}
                onChangeText={setName}
                value={name}
            />

            <Text style={[styles.label, { color: darkMode ? '#fff' : '#000' }]}>Leeftijd:</Text>
            <TextInput
                style={[styles.input, { color: darkMode ? '#fff' : '#000', borderColor: darkMode ? '#fff' : 'gray' }]}
                onChangeText={setNumber}
                value={number}
                placeholder="Enter a number"
                keyboardType="numeric"
            />

            <Pressable style={styles.button} onPress={saveSettings}>
                <Text style={styles.buttonText}>Opslaan</Text>
            </Pressable>

            <View style={styles.switchContainer}>
                <Text style={[styles.label, { color: darkMode ? '#fff' : '#000' }]}>Dark Mode:</Text>
                <Switch value={darkMode} onValueChange={toggleDarkMode} />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        height: 40,
        borderWidth: 1,
        padding: 10,
        marginBottom: 20,
    },
    button: {
        backgroundColor: "blue",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
    },
    buttonText: {
        color: "white",
        fontSize: 16,
    },
    switchContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 20,
    },
});