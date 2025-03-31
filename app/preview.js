import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getPhotoById } from '../utils/storage';

export default function PreviewScreen() {
  const { id } = useLocalSearchParams();
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    const loadPhoto = async () => {
      try {
        const photo = await getPhotoById(id);
        if (photo) {
          setPhoto(photo);
        } else {
          console.log("Foto não encontrada com o ID:", id);
        }
      } catch (error) {
        console.error("Erro ao carregar a foto:", error);
      }
    };

    loadPhoto();
  }, [id]);

  return (
    <View style={styles.container}>
      {photo ? (
        <>
          <Image style={styles.image} source={{ uri: photo.uri }} />
          {photo.location ? (
            <View style={styles.locationContainer}>
              <Text style={styles.locationText}>
                Latitude: {photo.location.latitude}
              </Text>
              <Text style={styles.locationText}>
                Longitude: {photo.location.longitude}
              </Text>
            </View>
          ) : (
            <Text>Localização não disponível</Text>
          )}
          {photo.timestamp ? (
            <Text style={styles.text}>
              Data e Hora: {new Date(photo.timestamp).toLocaleString()}
            </Text>
          ) : (
            <Text>Data e Hora não disponíveis</Text>
          )}
        </>
      ) : (
        <Text>Foto não encontrada!</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor:'#fff',
    width: "100%",
    height: "100%",
    // justifyContent: "center",
    alignItems: "center",
  },
  image: {
    marginTop: 20,
    width:'100%',
    height: '70%',
    resizeMode: "contain",
    marginBottom: 20,
  },
  locationContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  locationText: {
    fontSize: 16,
  },
});