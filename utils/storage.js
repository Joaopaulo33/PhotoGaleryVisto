// storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function savePhoto(uri, location, currentTime) {
  try {
    let photos = JSON.parse(await AsyncStorage.getItem("photos")) || [];
    const newPhoto = {
      id: `${Date.now()}`,
      uri: uri,
      location: location ? {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      } : null,
      timestamp: currentTime ? currentTime.toISOString() : null, // Salvar a data e hora
    };
    photos.push(newPhoto);
    await AsyncStorage.setItem("photos", JSON.stringify(photos));
  } catch (error) {
    console.error("Erro ao salvar a foto no AsyncStorage:", error);
    throw error;
  }
}

export async function getPhotos() {
  try {
    const photos = JSON.parse(await AsyncStorage.getItem("photos"));
    return photos || [];
  } catch (error) {
    console.error("Erro ao obter as fotos do AsyncStorage:", error);
    return [];
  }
}

export async function getPhotoById(id) {
  try {
    const photos = await getPhotos();
    const photo = photos.find(photo => photo.id === id);
    return photo || null;
  } catch (error) {
    console.error("Erro ao obter a foto por ID do AsyncStorage:", error);
    return null;
  }
}