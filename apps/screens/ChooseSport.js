import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Importing MaterialCommunityIcons

const sports = [
  { name: 'Basketball', icon: 'basketball' }, // MaterialCommunityIcons for basketball
  { name: 'Volleyball', icon: 'volleyball' }, // MaterialCommunityIcons for volleyball
  { name: 'Soccer', icon: 'soccer' }, // MaterialCommunityIcons for soccer
  { name: 'Tennis', icon: 'tennis' }, // MaterialCommunityIcons for tennis
  { name: 'Swimming', icon: 'pool' }, // MaterialCommunityIcons for swimmer
  { name: 'Cycling', icon: 'bike' }, // MaterialCommunityIcons for cycling
  { name: 'Running', icon: 'run' }, // MaterialCommunityIcons for running
  { name: 'Golf', icon: 'golf' }, // MaterialCommunityIcons for golf
];

const ChooseSportScreen = ({ navigation }) => {
  const [selectedSport, setSelectedSport] = useState(null);

  const handleSelectSport = (sport) => {
    setSelectedSport(sport);
  };

  const handleConfirm = () => {
    if (selectedSport) {
      navigation.navigate('Main');
    } else {
      alert('Please select a sport first');
    }
  };

  const renderSportItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.sportItem,
        selectedSport === item.name && styles.selectedSportItem,
      ]}
      onPress={() => handleSelectSport(item.name)}
    >
      <MaterialCommunityIcons 
        name={item.icon} 
        size={40} 
        color={selectedSport === item.name ? '#FFFFFF' : '#333333'} 
      />
      <Text style={[
        styles.sportText,
        selectedSport === item.name && styles.selectedSportText,
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
      <Text style={styles.title}></Text>
      <FlatList
        data={sports}
        renderItem={renderSportItem}
        keyExtractor={(item) => item.name}
        numColumns={2}
        contentContainerStyle={styles.sportList}
      />
      <TouchableOpacity
        style={[styles.confirmButton, !selectedSport && styles.disabledButton]}
        onPress={handleConfirm}
        disabled={!selectedSport}
      >
        <Text style={styles.confirmButtonText}>Confirm</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 20,
  },
  title: {
    fontWeight: 'bold',

    color: '#333333',
    textAlign: 'center',

  },
  sportList: {
    alignItems: 'center',
  },
  sportItem: {
    width: '45%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedSportItem: {
    backgroundColor: '#4CAF50',
  },
  sportText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  selectedSportText: {
    color: '#FFFFFF',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
  },
  disabledButton: {
    backgroundColor: '#A5D6A7',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ChooseSportScreen;
