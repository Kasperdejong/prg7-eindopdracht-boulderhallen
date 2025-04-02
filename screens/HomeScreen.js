import { FlatList, SafeAreaView, StyleSheet, Text } from "react-native";
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
                const response = await fetch("https://stud.hosted.hr.nl/1078780/bouldergyms.json", {
                    method: "GET",
                    headers: {
                        "Accept": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                setBoulderGyms(data);
            } catch (err) {
                setError(err.message);
            }
        };
        fetchBoulders();
    }, []);

    const renderItem = ({ item }) => <BoulderListItem boulderGym={item} />;
    console.log(boulderGyms);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: darkMode ? '#333' : '#f7f7f7' }]}>
            <Text style={[styles.headerText, { color: darkMode ? '#fff' : '#000' }]}>Welkom op de BoulderFinder</Text>
            <FlatList
                data={boulderGyms}
                renderItem={renderItem}
                numColumns={2}
                keyExtractor={(item) => item.id.toString()}
            />
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
        marginTop: 10,
    },
    itemContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        margin: 8,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5,
        alignItems: 'center',
        width: '45%', // Ensuring each item takes up about half the width for 2 columns
    },
    image: {
        width: '100%',
        height: 120,
        borderRadius: 8,
        marginBottom: 8,
    },
    itemText: {
        fontSize: 14,
        color: '#333',
        textAlign: 'center',
        marginBottom: 4,
    },
});