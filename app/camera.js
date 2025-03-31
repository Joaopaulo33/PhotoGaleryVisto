import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import { shareAsync } from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import { MaterialIcons } from '@expo/vector-icons';
import { savePhoto } from '../utils/storage';
import * as Location from 'expo-location'; // Importe o Location
import { useRouter } from "expo-router";




export default function CameraScreen() {
  const router = useRouter();

  let cameraRef = useRef();
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState(null);
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
      setHasCameraPermission(cameraPermission.status === 'granted');
      setHasMediaLibraryPermission(mediaLibraryPermission.status === 'granted');

      // Solicitar permissão de localização
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        setLocationPermissionGranted(true);
      } else {
        Alert.alert(
          'Permissão de localização negada',
          'Por favor, habilite a permissão de localização nas configurações.'
        );
      }
    })();
  }, []);

  if (
    hasCameraPermission === null ||
    hasMediaLibraryPermission === null ||
    !locationPermissionGranted
  ) {
    return <Text>Solicitando permissões...</Text>;
  } else if (!hasCameraPermission) {
    return (
      <Text>
        Permissão para a câmera não concedida. Por favor, altere nas configurações.
      </Text>
    );
  } else if (!hasMediaLibraryPermission) {
    return (
      <Text>
        Permissão para a biblioteca de mídia não concedida. Por favor, altere nas
        configurações.
      </Text>
    );
  }

  let tiraFoto = async () => {
    let options = {
      quality: 1,
      base64: true,
      exif: false,
    };

    let newPhoto = await cameraRef.current.takePictureAsync(options);
    setPhoto(newPhoto);
  };

  if (photo) {
    let salvarFoto = async () => {
      setIsSaving(true);
      try {
        // Obter a localização atual
        let location = null;
        try {
          location = await Location.getCurrentPositionAsync({});
        } catch (error) {
          console.error('Erro ao obter a localização:', error);
          Alert.alert(
            'Erro',
            'Não foi possível obter a localização. A foto será salva sem a localização.'
          );
        }
    
        // Obter a data e hora atual
        const currentTime = new Date();
    
        // Salvar a foto na biblioteca de mídia
        await MediaLibrary.saveToLibraryAsync(photo.uri);
    
        // Salvar a foto em um armazenamento personalizado (pode ser banco de dados, localStorage, etc.)
        await savePhoto(photo.uri, location, currentTime);
    
        // Após salvar a foto, navegar para a Galeria e atualizar a lista de fotos
        if (router && typeof router.push === 'function') {
          router.push({
            pathname: "/galeria", // Verifique se este é o caminho correto para a sua tela de Galeria
            params: { refreshGallery: true }, // Transmite um sinal para atualizar a galeria
          });
        }
    
        // Limpar estado da foto após salvar
        setPhoto(null);
      } catch (error) {
        console.error('Erro ao salvar a foto:', error);
      } finally {
        setIsSaving(false);
      }
    };

    return (
      <SafeAreaView style={styles.container}>
        <Image
          style={styles.preview}
          source={{ uri: 'data:image/jpg;base64,' + photo.base64 }}
        />
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={salvarFoto}
            disabled={isSaving}
          >
            <Text style={styles.buttonText}>{isSaving ? 'Salvando...' : 'Salvar'}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <CameraView style={styles.container} ref={cameraRef}>
      <View style={styles.cameraContainer}>
        <TouchableOpacity style={styles.takePictureButton} onPress={tiraFoto}>
          <MaterialIcons name="camera-alt" size={32} color="white" />
        </TouchableOpacity>
      </View>
    </CameraView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  takePictureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    borderWidth: 5,
    borderColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  preview: {
    alignSelf: 'stretch',
    flex: 1,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    padding: 20,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});