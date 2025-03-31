import React from "react";
import { TouchableOpacity, Image, StyleSheet } from "react-native";

export default function ImageCard({ photo, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <Image source={{ uri: photo.uri }} style={styles.image} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 8,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
});