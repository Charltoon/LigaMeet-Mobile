import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, SafeAreaView, StatusBar, Image, ActivityIndicator } from 'react-native';

const ChooseSportScreen = ({ navigation }) => {
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSport, setSelectedSport] = useState(null);

  // Fetch sports from API
  useEffect(() => {
    const fetchSports = async () => {
      try {
        const response = await fetch('http://192.168.1.2:8000/api/sports/'); // Replace with your API URL
        const data = await response.json();
        setSports(data);
      } catch (error) {
        console.error('Error fetching sports:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSports();
  }, []);

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
        selectedSport === item.SPORT_NAME && styles.selectedSportItem,
      ]}
      onPress={() => handleSelectSport(item.SPORT_NAME)}
    >
      {item.IMAGE ? (
        <Image source={{ uri: item.IMAGE }} style={styles.sportImage} />
      ) : (
        <View style={styles.placeholderIcon}>
          <Text style={styles.placeholderText}>No Image</Text>
        </View>
      )}
      <Text
        style={[
          styles.sportText,
          selectedSport === item.SPORT_NAME && styles.selectedSportText,
        ]}
      >
        {item.SPORT_NAME}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
      <Text style={styles.title}>Choose a Sport</Text>
      <FlatList
        data={sports}
        renderItem={renderSportItem}
        keyExtractor={(item) => item.id.toString()}
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
    fontSize: 20,
    color: '#333333',
    textAlign: 'center',
    marginVertical: 10,
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
  sportImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  placeholderIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#DDDDDD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#888888',
    fontSize: 12,
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
