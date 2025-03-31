import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Alert } from "react-native";
import { Camera } from "expo-camera";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons"; // Ícone para o botão

export default function CameraComponent() {
  const [hasPermission, setHasPermission] = useState(null);
  const cameraRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 1,
          exif: true,
        });
        console.log("Foto tirada:", photo.uri);
        router.push({ pathname: "/preview", params: { photoUri: photo.uri } });
      } catch (error) {
        Alert.alert(
          "Erro",
          "Não foi possível tirar a foto. Por favor, tente novamente."
        );
      }
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Solicitando permissão para câmera...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Permissão negada. Por favor, permita o acesso à câmera nas configurações do dispositivo.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <MaterialIcons name="camera-alt" size={32} color="white" />
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  camera: {
    flex: 1,
    justifyContent: "flex-end",
  },
  buttonContainer: {
    backgroundColor: "transparent",
    alignSelf: "center",
    marginBottom: 20,
  },
  captureButton: {
    width: 70,
    height: 70,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 35,
    borderWidth: 3,
    borderColor: "white",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    fontSize: 16,
  },
});