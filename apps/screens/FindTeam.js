import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FindTeamScreen = () => {
  const [teams, setTeams] = useState([]); // To store all available teams
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); // To control modal visibility
  const [selectedTeam, setSelectedTeam] = useState(null); // To store the selected team details

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const session = await AsyncStorage.getItem('userSession');
      if (!session) throw new Error('User session not found');

      const { user_id: userId } = JSON.parse(session);
      if (!userId) throw new Error('User ID not found in session');

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

  const handleJoinRequest = async (teamId) => {
    setLoading(true); // Optionally, show a loading indicator during the request
    try {
      const session = await AsyncStorage.getItem('userSession');
      if (!session) throw new Error('User session not found');
  
      const { user_id: userId } = JSON.parse(session);
      if (!userId) throw new Error('User ID not found in session');
  
      const response = await fetch('http://192.168.1.2:8000/api/join/team/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          user_id: userId,
          team_id: teamId,
        }).toString(),
      });
  
      if (response.ok) {
        const data = await response.json();
        alert(data.message || 'Join request sent successfully!');
        setModalVisible(false); // Close the modal on success
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to send join request.');
      }
    } catch (error) {
      console.error('Error sending join request:', error);
      alert('An error occurred while sending the join request.');
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamDetails = (team) => {
    setSelectedTeam(team);
    setModalVisible(true);
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Find Your Team</Text>

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
                <TouchableOpacity
                  style={styles.viewButton}
                  onPress={() => fetchTeamDetails(team)}
                >
                  <Text style={styles.buttonText}>View Team</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Modal for displaying team details */}
      {selectedTeam && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedTeam.name}</Text>
              <Text style={styles.modalSubtitle}>Coach: {selectedTeam.coach}</Text>
              <Text style={styles.modalSectionTitle}>Team Members:</Text>
              {selectedTeam.members.map((member, index) => (
                <Text key={index} style={styles.modalText}>
                  - {member.name}
                </Text>
              ))}
              <TouchableOpacity
                style={styles.joinButton}
                onPress={() => handleJoinRequest(selectedTeam.id)}
              >
                <Text style={styles.joinButtonText}>Join Team</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 5,
  },
  joinButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  joinButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#FF4136',
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FindTeamScreen;
