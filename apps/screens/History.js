import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HistoryScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>History of all matches</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F6F8FB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2D3D',
  },
});

export default HistoryScreen;
