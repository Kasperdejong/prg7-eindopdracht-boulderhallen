import React, { useContext } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { DarkModeContext } from '../providers/DarkModeProvider';

export default function BoulderListItem({ boulderGym }) {
    const { darkMode } = useContext(DarkModeContext);

    return (
        <View style={[styles.container, { backgroundColor: darkMode ? '#333' : '#fff' }]}>
            <Text style={[styles.title, { color: darkMode ? '#fff' : '#000' }]}>{boulderGym.name}</Text>
            <Image style={styles.image} source={{ uri: boulderGym.imageUrl }} />
            <Text style={[styles.stad, { color: darkMode ? '#fff' : '#000' }]}>Deze gym is in: {boulderGym.city}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        borderRadius: 10,
        margin: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    image: {
        height: 200,
        width: '100%',
        marginVertical: 16,
        borderRadius: 8,
    },
    stad: {
        fontSize: 16,
    },
});