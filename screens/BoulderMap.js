import MapView, { Marker } from 'react-native-maps';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useState, useEffect, useRef } from 'react';
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

    const activeGymRef = useRef(null);

    // Reset state when screen loses focus
    useEffect(() => {
        const unsubscribe = navigation.addListener('blur', () => {
            navigation.setParams({ gymId: null });
            setActiveGym(null);
            setRegion(defaultRegion);
        });
        return unsubscribe;
    }, [navigation]);

    // Fetch gyms + location permission
    useEffect(() => {
        const fetchBoulders = async () => {
            try {
                const response = await fetch("https://stud.hosted.hr.nl/1078780/bouldergyms.json");
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                const data = await response.json();
                const processedGyms = data.map(gym => ({
                    ...gym,
                    latitude: +gym.latitude,
                    longitude: +gym.longitude,
                }));
                setBoulderGyms(processedGyms);
            } catch (err) {
                console.error(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        const getLocation = async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                Location.watchPositionAsync(
                    {
                        accuracy: Location.Accuracy.High,
                        timeInterval: 5000,
                        distanceInterval: 10
                    },
                    (location) => {
                        if (!gymId && !activeGym) {
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
        };

        fetchBoulders();
        getLocation();
    }, []);

    // When gymId is passed in from HomeScreen
    useEffect(() => {
        if (gymId && boulderGyms.length >= 43) {
            const selectedGym = boulderGyms.find(gym => String(gym.id) === String(gymId));
            if (selectedGym) {
                setRegion({
                    latitude: selectedGym.latitude,
                    longitude: selectedGym.longitude,
                    latitudeDelta: 0.03,
                    longitudeDelta: 0.03,
                });
                setActiveGym(selectedGym);
                setTimeout(() => {
                    if (activeGymRef.current) {
                        activeGymRef.current.showCallout();
                    }
                }, 500);
            }
        }
    }, [gymId, boulderGyms]);

    // Wait until all 43 gyms are loaded
    if (isLoading || boulderGyms.length < 43) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <MapView style={styles.map} region={region} showsUserLocation={true}>
                {boulderGyms.map((gym) => (
                    <Marker
                        key={gym.id}
                        coordinate={{ latitude: gym.latitude, longitude: gym.longitude }}
                        title={gym.name}
                        description={gym.city}
                        pinColor={activeGym && gym.id === activeGym.id ? "blue" : "red"}
                        ref={gym.id === activeGym?.id ? activeGymRef : null}
                    />
                ))}
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
