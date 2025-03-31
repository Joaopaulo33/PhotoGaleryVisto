import { View, Text, Image, StyleSheet } from "react-native";

export default function DetailScreen(props) {


  return (
    <View style={styles.container}>
      <Image source={{ uri: photoUri }} style={styles.image} />
      <Text style={styles.text}>Detalhes da Foto</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 16,
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 162,
  },
  text: {
    fontSize: 18,
  },
});