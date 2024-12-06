import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FindTeamScreen = () => {
  const [activeTab, setActiveTab] = useState('myTeam');
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const userId = await AsyncStorage.getItem('user_id'); // Assuming user_id is stored in AsyncStorage
      console.log('User ID:', userId);  
      if (!userId) throw new Error('User ID not found');

      const response = await fetch(`http://192.168.1.2:8000/api/fetch/teams/?user_id=${userId}`);
      const data = await response.json();

      if (response.ok) {
        setTeams(data.teams);
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Find Your Team</Text>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'myTeam' && styles.activeTab]}
            onPress={() => setActiveTab('myTeam')}
          >
            <Text style={[styles.tabText, activeTab === 'myTeam' && styles.activeTabText]}>My Team</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'findTeam' && styles.activeTab]}
            onPress={() => setActiveTab('findTeam')}
          >
            <Text style={[styles.tabText, activeTab === 'findTeam' && styles.activeTabText]}>Find Team</Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'myTeam' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>My Team</Text>
            <Text style={styles.placeholderText}>No team assigned yet.</Text>
          </View>
        )}

        {activeTab === 'findTeam' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Find Teams</Text>
            {loading ? (
              <ActivityIndicator size="large" color="#3C4858" />
            ) : (
              teams.map((team) => (
                <View key={team.id} style={styles.teamItem}>
                  <Image
                    source={{ uri: team.logo_url || 'https://via.placeholder.com/50' }}
                    style={styles.teamLogo}
                  />
                  <View style={styles.teamInfoContainer}>
                    <Text style={styles.teamName}>{team.name}</Text>
                    <Text style={styles.teamType}>Type: {team.type}</Text>
                    <Text style={styles.teamCoach}>Coach: {team.coach}</Text>
                  </View>
                  <TouchableOpacity style={styles.viewButton}>
                    <Text style={styles.buttonText}>View Team</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F8FB',
    padding: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: '#1F2D3D',
    textAlign: 'center',
    marginVertical: 25,
    fontFamily: 'Roboto',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#E5E9F2',
    borderRadius: 8,
    marginHorizontal: 5,
  },
  activeTab: {
    backgroundColor: '#3C4858',
  },
  tabText: {
    fontWeight: 'bold',
    color: '#1F2D3D',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  section: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1F2D3D',
  },
  coachText: {
    fontSize: 14,
    color: '#3C4858',
    marginBottom: 5,
  },
  membersText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3C4858',
    marginBottom: 5,
  },
  memberItem: {
    color: '#3C4858',
    marginLeft: 10,
    marginBottom: 5,
  },
  teamItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  teamLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  teamInfoContainer: {
    flex: 1,
  },
  teamName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#1F2D3D',
  },
  teamType: {
    fontSize: 14,
    color: '#3C4858',
  },
  leaveButton: {
    backgroundColor: '#F44336',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 15,
    alignItems: 'center',
  },
  viewButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default FindTeamScreen;
