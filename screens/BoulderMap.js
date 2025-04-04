import MapView, { Marker } from 'react-native-maps';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

export default function BoulderMap({ route }) {
    const navigation = useNavigation();
    const { gymId } = route.params || {};

    const defaultRegion = {
        latitude: 51.9172,
        longitude: 4.4840,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
    };

    const [boulderGyms, setBoulderGyms] = useState([]);
    const [region, setRegion] = useState(defaultRegion);
    const [activeGym, setActiveGym] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // When the screen loses focus, reset gymId, activeGym, and region to default.
    useEffect(() => {
        const unsubscribe = navigation.addListener('blur', () => {
            // Clear the gym selection so the next time the map is shown, it loads all markers
            navigation.setParams({ gymId: null });
            setActiveGym(null);
            setRegion(defaultRegion);
        });
        return unsubscribe;
    }, [navigation]);

    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                Location.watchPositionAsync(
                    { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 10 },
                    (location) => {
                        // Only update the region from user location if no gymId is provided.
                        if (!gymId) {
                            setRegion({
                                latitude: location.coords.latitude,
                                longitude: location.coords.longitude,
                                latitudeDelta: 0.1,
                                longitudeDelta: 0.1,
                            });
                        }
                    }
                );
            } else {
                alert('Permission to access location was denied');
            }
        })();

        const fetchBoulders = async () => {
            try {
                const response = await fetch("https://stud.hosted.hr.nl/1078780/bouldergyms.json");
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                const data = await response.json();
                setBoulderGyms(
                    data.map(gym => ({
                        ...gym,
                        latitude: +gym.latitude,
                        longitude: +gym.longitude,
                    }))
                );
            } catch (err) {
                console.error(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchBoulders();
    }, []);

    useEffect(() => {
        if (gymId && boulderGyms.length > 0) {
            const selectedGym = boulderGyms.find(gym => String(gym.id) === String(gymId));
            if (selectedGym) {
                setRegion({
                    latitude: selectedGym.latitude,
                    longitude: selectedGym.longitude,
                    latitudeDelta: 0.1,
                    longitudeDelta: 0.1,
                });
                setActiveGym(selectedGym);
            }
        }
    }, [gymId, boulderGyms]);

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <MapView style={styles.map} region={region} showsUserLocation={true}>
                {gymId && activeGym ? (
                    <Marker
                        key={activeGym.id}
                        coordinate={{
                            latitude: activeGym.latitude,
                            longitude: activeGym.longitude,
                        }}
                        title={activeGym.name}
                        description={activeGym.city}
                        pinColor="blue"
                    />
                ) : (
                    boulderGyms.map((gym) => (
                        <Marker
                            key={gym.id}
                            coordinate={{ latitude: gym.latitude, longitude: gym.longitude }}
                            title={gym.name}
                            description={gym.city}
                        />
                    ))
                )}
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { width: '100%', height: '100%' },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
