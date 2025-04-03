import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useContext, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import BoulderListItem from "../components/BoulderListItem";
import { DarkModeContext } from "../providers/DarkModeProvider";

export default function HomeScreen() {
    const navigation = useNavigation();
    const { darkMode } = useContext(DarkModeContext);
    const [boulderGyms, setBoulderGyms] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBoulders = async () => {
            try {
                const response = await fetch("https://stud.hosted.hr.nl/1078780/bouldergyms.json");
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

                const data = await response.json();
                setBoulderGyms(data);
            } catch (err) {
                setError(err.message);
            }
        };
        fetchBoulders();
    }, []);

    const handlePress = (gym) => {
        navigation.navigate('Map', { gymId: gym.id });
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => handlePress(item)} style={styles.itemWrapper}>
            <BoulderListItem boulderGym={item} />
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
