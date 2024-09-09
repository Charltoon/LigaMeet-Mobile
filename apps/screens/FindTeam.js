import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FindTeamScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Find a Team</Text>
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

export default FindTeamScreen;
