import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useContext, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import BoulderListItem from "../components/BoulderListItem";
import { DarkModeContext } from "../providers/DarkModeProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics'

export default function HomeScreen() {
    const navigation = useNavigation();
    const { darkMode } = useContext(DarkModeContext);
    const [boulderGyms, setBoulderGyms] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const rnBiometrics = new ReactNativeBiometrics()



    useEffect(() => {
        const fetchBoulders = async () => {
            try {
                const response = await fetch("https://stud.hosted.hr.nl/1078780/bouldergyms.json");
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

                const data = await response.json();
                setBoulderGyms(data);
            } catch (err) {
                console.error(err);
            }
        };

        const loadFavorites = async () => {
            const storedFavorites = await AsyncStorage.getItem('favorites');
            if (storedFavorites) {
                setFavorites(JSON.parse(storedFavorites));
            }
        };
        fetchBoulders();
        loadFavorites();
    }, []);

    const handlePress = (gym) => {
        navigation.navigate('Map', { gymId: gym.id });
    };

    const toggleFavorite = async (gym) => {
        const { available, biometryType } = await rnBiometrics.isSensorAvailable();

        if (!available) {
            console.warn('Biometrics not available');
            return;
        }

        const promptMessage = biometryType === BiometryTypes.FaceID
            ? 'Use Face ID to authenticate'
            : 'Authenticate to modify favorites';

        const result = await rnBiometrics.simplePrompt({ promptMessage });

        if (result.success) {
            let updatedFavorites;
            if (favorites.some(fav => fav.id === gym.id)) {
                updatedFavorites = favorites.filter(fav => fav.id !== gym.id);
            } else {
                updatedFavorites = [...favorites, gym];
            }
            setFavorites(updatedFavorites);
            await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        } else {
            console.log('Biometric authentication cancelled or failed');
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => handlePress(item)} style={styles.itemWrapper}>
            <BoulderListItem
                boulderGym={item}
                isFavorite={favorites.some(fav => fav.id === item.id)}
                toggleFavorite={toggleFavorite}
            />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: darkMode ? '#333' : '#f7f7f7' }]}>
            <Text style={[styles.headerText, { color: darkMode ? '#fff' : '#000' }]}>Welkom op de BoulderFinder</Text>
            <View style={{ flex: 1 }}>
                <FlatList
                    data={boulderGyms}
                    renderItem={renderItem}
                    numColumns={2}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.flatListContainer}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16,
    },
    flatListContainer: {
        justifyContent: 'space-between',
        paddingHorizontal: 8,
    },
    itemWrapper: {
        flex: 1,
        alignItems: 'center',
    },
});
