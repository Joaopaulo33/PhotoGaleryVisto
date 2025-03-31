// utils/storage.test.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { savePhoto, getPhotos, getPhotoById } from './storage';

// Limpar o AsyncStorage antes de cada teste
beforeEach(async () => {
  await AsyncStorage.clear();
});

describe('storage', () => {
  it('should save a photo and retrieve it', async () => {
    const uri = 'test-uri';
    const location = { latitude: 123, longitude: 456 };
    const currentTime = new Date();

    await savePhoto(uri, location, currentTime);
    const photos = await getPhotos();

    expect(photos.length).toBe(1);
    expect(photos[0].uri).toBe(uri);
    expect(photos[0].location).toEqual(location);
    expect(new Date(photos[0].timestamp)).toEqual(currentTime);
  });

  it('should retrieve an empty array when there are no photos', async () => {
    const photos = await getPhotos();
    expect(photos).toEqual([]);
  });

  it('should get a photo by id', async () => {
    const uri = 'test-uri';
    const location = { latitude: 123, longitude: 456 };
    const currentTime = new Date();

    await savePhoto(uri, location, currentTime);
    const photos = await getPhotos();
    const photoId = photos[0].id;

    const photo = await getPhotoById(photoId);
    expect(photo.uri).toBe(uri);
  });

  it('should return null when photo with id is not found', async () => {
    const photo = await getPhotoById('non-existent-id');
    expect(photo).toBeNull();
  });
});