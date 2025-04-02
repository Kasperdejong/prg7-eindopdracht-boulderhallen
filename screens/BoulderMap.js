import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View } from 'react-native';
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export default function BoulderMap() {
    const [path, setPath] = useState([]);
    const [schoolRegion, setSchoolRegion] = useState({
        latitude: 51.917212970903705,
        longitude: 4.484049974154928,
        latitudeDelta: 0.003,
        longitudeDelta: 0.003,
    });
    const [region, setRegion] = useState(null);

    const requestPermission = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            alert('Permission to access location was denied');
            return;
        }

        Location.watchPositionAsync(
            { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 10 },
            (location) => {
                const newRegion = {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.003,
                    longitudeDelta: 0.003,
                };
                setRegion(newRegion);
                setPath((prevPath) => [...prevPath, { latitude: newRegion.latitude, longitude: newRegion.longitude }]);
            }
        );
    };

    useEffect(() => {
        requestPermission();
        return () => {
            if (location) {
                location.remove();
            }
        }
    }, []);

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                region={region || schoolRegion}
                showsUserLocation={true}
                followsUserLocation={true}
            >
                <Marker
                    coordinate={{
                        latitude: 51.917212970903705,
                        longitude: 4.484049974154928,
                    }}
                    title="Wijnhaven 99"
                    description="Schoolgebouw"
                />
                {path.map((coord, index) => (
                    <Marker key={index} coordinate={coord} />
                ))}
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: '100%',
        height: '100%',
    },
});