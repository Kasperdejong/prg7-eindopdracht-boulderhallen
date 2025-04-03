import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View } from 'react-native';
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export default function BoulderMap({ route }) {
    const { gymId } = route.params || {};
    const [boulderGyms, setBoulderGyms] = useState([]);
    const [region, setRegion] = useState(null);

    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                Location.watchPositionAsync(
                    { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 10 },
                    (location) => {
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
                setBoulderGyms(data.map(gym => ({
                    ...gym,
                    latitude: +gym.latitude,
                    longitude: +gym.longitude,
                })));
            } catch (err) {
                console.error(err.message);
            }
        };
        fetchBoulders();
    }, []);

    useEffect(() => {
        if (gymId && boulderGyms.length > 0) {
            const selectedGym = boulderGyms.find(gym => gym.id === gymId);
            if (selectedGym) {
                setRegion({
                    latitude: +selectedGym.latitude,
                    longitude: +selectedGym.longitude,
                    latitudeDelta: 0.1,
                    longitudeDelta: 0.1,
                });
            }
        }
    }, [gymId, boulderGyms]);

    return (
        <View style={styles.container}>
            <MapView style={styles.map} region={region} showsUserLocation={true}>
                {boulderGyms.map((gym) => (
                    <Marker key={gym.id} coordinate={{ latitude: gym.latitude, longitude: gym.longitude }} title={gym.name} description={gym.city} />
                ))}
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { width: '100%', height: '100%' },
});