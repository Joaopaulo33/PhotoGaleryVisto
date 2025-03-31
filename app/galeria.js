import React, { useEffect, useState } from "react";
import { View, FlatList, Button, StyleSheet, Text } from "react-native";
import { useRouter } from "expo-router";
import { getPhotos } from "../utils/storage";
import ImageCard from "../components/ImageCard";
import CameraButton from "../components/CameraButton";

export default function GalleryScreen() {
  const [photos, setPhotos] = useState([]);
  const router = useRouter();

  const loadPhotos = async () => {
    const storedPhotos = await getPhotos();
    setPhotos(storedPhotos || []);
  };

  useEffect(() => {
    loadPhotos();
  }, []); // Executa na montagem inicial

  useEffect(() => {
    if (router.params && router.params.refreshGallery) {
      loadPhotos();
    }
  }, [router.params]); // Run effect whenever router.params change
  // Função para ser chamada de volta pela tela de câmera
  const refreshGallery = async () => {
    await loadPhotos();
  };

  return (
    <View style={styles.container}>
      <CameraButton onPress={()=>{ router.push({
            pathname: "/camera",
            params: { refreshGallery: refreshGallery },
          })}}/>

      <FlatList
        style={styles.photoList}
        data={photos}
        horizontal={true}
        flexDirection="row"
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ImageCard
            photo={item}
            onPress={() => router.push(`/preview?id=${item.id}`)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.containerEmpty}>
            <Text style={styles.empty}>Nenhuma foto salva ainda</Text>
          </View>

        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    display: "flex",
    flexDirection: "row",
    justifyContent:"center"
  },
  empty: {
    textAlign: "center",
    justifyContent:"center",
    marginTop: 20,
    fontSize: 16,
    color: "#888",
  },
  photoList: {
    display: "flex",
    flexDirection: "column",
  },
  containerEmpty:{
    alignSelf:"center"
  }
});