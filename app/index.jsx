// app/index.js
import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import GalleryScreen from './galeria';

export const config = {
  title: 'Página Inicial', // Define o título da tela inicial
};

export default function Index() {
  return (
    <SafeAreaView style={styles.container}>
      <GalleryScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor:'#fff',
    flex: 1,
  },
});