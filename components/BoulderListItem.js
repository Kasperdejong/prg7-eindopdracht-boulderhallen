import React, { useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { DarkModeContext } from '../providers/DarkModeProvider';
import {Ionicons} from "@expo/vector-icons";

export default function BoulderListItem({ boulderGym, isFavorite, toggleFavorite }) {
    const { darkMode } = useContext(DarkModeContext);

    return (
        <View style={[styles.itemContainer, { backgroundColor: darkMode ? '#333' : '#fff' }]}>
            <Text style={[styles.title, { color: darkMode ? '#fff' : '#000' }]} numberOfLines={2} ellipsizeMode="tail">
                {boulderGym.name}
            </Text>
            <Image style={styles.image} source={{ uri: boulderGym.imageUrl }} />
            <Text style={[styles.stad, { color: darkMode ? '#fff' : '#000' }]}>Locatie: {boulderGym.city}</Text>

            <TouchableOpacity onPress={() => toggleFavorite(boulderGym)} style={styles.favoriteButton}>
                <Ionicons name={isFavorite ? "star" : "star-outline"} size={24} color="gold" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    itemContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        borderStyle: "solid",
        borderBlockColor: "#000",
        margin: 8,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        elevation: 3,
        alignItems: 'center',
        width: '95%',
        height: 250,
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        minHeight: 44,
    },
    image: {
        height: 130,
        width: '100%',
        borderRadius: 8,
    },
    stad: {
        fontSize: 16,
        fontWeight: '600',
        minHeight: 24,
    },
    favoriteButton: {
        padding: 5,
},
});
